<?php

include "users.class.php";

class UserValues extends Users {
    private $users_values = array();

    function __construct() {
        parent::__construct();
    }

    private function select_day_values($tables, $columns, $to, $limit = null) {
        $l = 7;
        if ($limit != null && $limit <= 40) {
            $l = $limit;
        }
        $this->users_values['day'] = array();
        foreach($tables as $table) {
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
            $result = $this->db->prepare($request);
            $result->bindParam(':todt', $to);
            $result->bindParam(':limit', $l, PDO::PARAM_INT);
            if (!$result->execute()) return false;
            array_push($this->users_values['day'], array(
                'id' => (int)substr($table, 5),
                'values' => $result->fetchAll(PDO::FETCH_NUM)
            ));
        }
        return true;
    }

    private function select_week_values($tables, $columns, $to, $limit = null) {
        $l = 4;
        if ($limit != null && $limit <= 12) {
            $l = $limit;
        }
        $this->users_values['week'] = array();
        foreach($tables as $table) {
            $request = <<<HERE
                    SELECT
                        DATE_FORMAT(`toDT`, '%d %b %Y') as d,
                        $columns
                    FROM
                        `$table`
                    WHERE
                        `toDT` <= :todt
                    GROUP BY
                        EXTRACT(WEEK FROM `toDT`)
                    ORDER BY `toDT` DESC
                    LIMIT :limit
HERE;
            $result = $this->db->prepare($request);
            $result->bindParam(':todt', $to);
            $result->bindParam(':limit', $l, PDO::PARAM_INT);
            if (!$result->execute()) return false;
            array_push($this->users_values['week'], array(
                'id' => (int)substr($table, 5),
                'values' => $result->fetchAll(PDO::FETCH_NUM)
            ));
        }
        return true;
    }

    private function select_month_values($tables, $columns, $to, $limit = null) {
        $l = 12;
        if ($limit != null && $limit <= 24) {
            $l = $limit;
        }
        $this->users_values['month'] = array();
        foreach($tables as $table) {
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
            $result = $this->db->prepare($request);
            $result->bindParam(':todt', $to);
            $result->bindParam(':limit', $l, PDO::PARAM_INT);
            if (!$result->execute()) return false;
            array_push($this->users_values['month'], array(
                'id' => (int)substr($table, 5),
                'values' => $result->fetchAll(PDO::FETCH_NUM)
            ));
        }
        return true;
    }


    public function select_data($ids, $to, $type = null, $field = null, $limit = null) {
        $tables = $this->get_tables_exists($ids);
        if (count($tables) == 0)
            return false;

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

        switch($type) {
            case 'day':
                $result  = $this->select_day_values($tables, $columns, $to, $limit);
                break;
            case 'week':
                $result  = $this->select_week_values($tables, $columns, $to, $limit);
                break;
            case 'month':
                $result  = $this->select_month_values($tables, $columns, $to, $limit);
                break;
            default:
                $result = ($this->select_day_values($tables, $columns, $to) &&
                    $this->select_week_values($tables, $columns, $to) &&
                    $this->select_month_values($tables, $columns, $to));
                break;
        }

        return $result;
    }

    public function get_data() {
        return $this->users_values;
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>