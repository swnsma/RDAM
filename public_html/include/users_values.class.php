<?php

include_once __DIR__ . '/users.class.php';

class UserValues extends Users {
    private $users_values = array();

    function __construct() {
        parent::__construct();
    }

    private function get_users_exists($ids) {
        $r = $this->server_db->query('SELECT `id`, `type_db` FROM `users` WHERE `id` IN (' . implode(',', $ids) . ')');
        return $r->fetchAll(PDO::FETCH_ASSOC);
    }

    private function get_auth($ids) {
        $r = $this->server_db->query('SELECT * FROM `auth` WHERE `id` IN (' . implode(',', $ids) . ')');
        if ($r && $r->rowCount() > 0) {
            return $r->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return null;
        }
    }

    private function select_day_values($server, $id, $table, $columns, $to, $limit = 7) {
        $request = <<<HERE
            SELECT
                DATE_FORMAT(`toDT`, '%d %b %Y') as d,
                $columns
            FROM
                `$table`
            WHERE
                `toDT` <= :todt
            GROUP BY
                d
            ORDER BY `toDT` DESC
            LIMIT :limit
HERE;
        $result = $server->prepare($request);
        $result->bindParam(':todt', $to);
        $result->bindParam(':limit', $limit, PDO::PARAM_INT);
        if ($result->execute()) {
            array_push($this->users_values['day'], array(
                'id' => $id,
                'values' => $result->fetchAll(PDO::FETCH_NUM)
            ));
            return true;
        }
        return false;
    }

    private function select_week_values($server, $id, $table, $columns, $to, $limit = 4) {
        $request = <<<HERE
            SELECT
                DATE_FORMAT(`toDT`, '%d %b %Y') as d,
                $columns
            FROM
                `$table`
            WHERE
                `toDT` <= :todt
            GROUP BY
                DATE_FORMAT(`toDT`, '%u')
            ORDER BY `toDT` DESC
            LIMIT :limit
HERE;
        //EXTRACT(WEEK FROM `toDT`)
        $result = $server->prepare($request);
        $result->bindParam(':todt', $to);
        $result->bindParam(':limit', $limit, PDO::PARAM_INT);
        if ($result->execute()) {
            array_push($this->users_values['week'], array(
                'id' => $id,
                'values' => $result->fetchAll(PDO::FETCH_NUM)
            ));
            return true;
        }
        return false;
    }

    private function select_month_values($server, $id, $table, $columns, $to, $limit = 12) {
        $request = <<<HERE
            SELECT
                DATE_FORMAT(`toDT`, '%b %Y') as d,
                $columns
            FROM
                `$table`
            WHERE
                `toDT` <= :todt
            GROUP BY
                d
            ORDER BY `toDT` DESC
            LIMIT :limit
HERE;
        $result = $server->prepare($request);
        $result->bindParam(':todt', $to);
        $result->bindParam(':limit', $limit, PDO::PARAM_INT);
        if ($result->execute()) {
            array_push($this->users_values['month'], array(
                'id' => $id,
                'values' => $result->fetchAll(PDO::FETCH_NUM)
            ));
            return true;
        }
        return false;
    }


    public function select_data($ids, $to, $type = null, $field = null, $limit = null) {
        $users = $this->get_users_exists($ids);

        $local_users = array();
        $remote_users = array();
        $cl = 0;
        $cr = 0;
        foreach($users as $user) {
            if ($user['type_db'] == 0) {
                array_push($local_users, $user['id']);
                ++$cl;
            } else {
                array_push($remote_users, $user['id']);
                ++$cr;
            }
        }

        if ($cl == 0 && $cr == 0) return false;

        switch($field) {
            case 'consumption':
                $columns = <<<HERE
                    SUM(`consumption`) as c
HERE;
                break;
            case 'production':
                $columns = <<<HERE
                    SUM(`production`) as p
HERE;
                break;
            default:
                $columns = <<<HERE
                    SUM(`production`) as p,
                    SUM(`consumption`) as c
HERE;
                break;
        }

        $l = 0;
        switch($type) {
            case 'day':
                $this->users_values['day'] = array();
                $l = 7;
                if ($limit != null && $limit <= 42) {
                    $l = $limit;
                }
                break;
            case 'week':
                $this->users_values['week'] = array();
                $l = 4;
                if ($limit != null && $limit <= 21) {
                    $l = $limit;
                }
                break;
            case 'month':
                $this->users_values['month'] = array();
                $l = 12;
                if ($limit != null && $limit <= 24) {
                    $l = $limit;
                }
                break;
            default:
                $this->users_values['day'] = array();
                $this->users_values['week'] = array();
                $this->users_values['month'] = array();
                break;
        }

        if ($cl != 0) {
            $values_db = Connection::conn_values_db();
            switch($type) {
                case 'day':
                    foreach($local_users as $id) {
                        if (!$this->select_day_values($values_db,
                                $id, 'user_' . $id, $columns, $to, $l)) {
                            return false;
                        }
                    }
                    break;
                case 'week':
                    foreach($local_users as $id) {
                        if (!$this->select_week_values($values_db,
                                $id, 'user_' . $id, $columns, $to, $l)) {
                            return false;
                        }
                    }
                    break;
                case 'month':
                    foreach($local_users as $id) {
                        if (!$this->select_month_values($values_db,
                            $id, 'user_' . $id, $columns, $to, $l)) {
                            return false;
                        }
                    }
                    break;
                default:
                    foreach($local_users as $id) {
                        if (!($this->select_day_values($values_db,
                                $id, 'user_' . $id, $columns, $to)
                            && $this->select_week_values($values_db,
                                $id, 'user_' . $id, $columns, $to)
                            && $this->select_month_values($values_db,
                                $id, 'user_' . $id, $columns, $to))) {
                            return false;
                        }
                    }
                    break;
            }
        }

        if ($cr != 0) {
            if (null == $auth = $this->get_auth($remote_users)) return false;
            $c = count($remote_users);
            switch($type) {
                case 'day':
                    for($i = 0; $i < $c; ++$i) {
                        $values_db = Connection::conn_values_db(
                            $auth[$i]['db_server'],
                            $auth[$i]['db_name'],
                            $auth[$i]['db_user'],
                            $auth[$i]['db_password'],
                            $auth[$i]['db_port']);
                        if (!$this->select_day_values($values_db,
                            $remote_users[$i], 'values', $columns, $to, $l)) {
                            return false;
                        }
                    }
                    break;
                case 'week':
                    for($i = 0; $i < $c; ++$i) {
                        $values_db = Connection::conn_values_db(
                            $auth[$i]['db_server'],
                            $auth[$i]['db_name'],
                            $auth[$i]['db_user'],
                            $auth[$i]['db_password'],
                            $auth[$i]['db_port']);
                        if (!$this->select_week_values($values_db,
                            $remote_users[$i], 'values', $columns, $to, $l)) {
                            return false;
                        }
                    }
                    break;
                case 'month':
                    for($i = 0; $i < $c; ++$i) {
                        $values_db = Connection::conn_values_db(
                            $auth[$i]['db_server'],
                            $auth[$i]['db_name'],
                            $auth[$i]['db_user'],
                            $auth[$i]['db_password'],
                            $auth[$i]['db_port']);
                        if (!$this->select_month_values($values_db,
                            $remote_users[$i], 'values', $columns, $to, $l)) {
                            return false;
                        }
                    }
                    break;
                default:
                    for($i = 0; $i < $c; ++$i) {
                        $values_db = Connection::conn_values_db(
                            $auth[$i]['db_server'],
                            $auth[$i]['db_name'],
                            $auth[$i]['db_user'],
                            $auth[$i]['db_password'],
                            $auth[$i]['db_port']);
                        if (!($this->select_day_values($values_db,
                                $remote_users[$i], 'values', $columns, $to)
                            && $this->select_week_values($values_db,
                                $remote_users[$i], 'values', $columns, $to)
                            && $this->select_month_values($values_db,
                                $remote_users[$i], 'values', $columns, $to))) {
                            return false;
                        }
                    }
                    break;
            }
        }

        return true;
    }

    public function get_data() {
        return $this->users_values;
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>