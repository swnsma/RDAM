<?php

include "users.class.php";

class UserValues extends Users {
    private $users_values = array();

    function __construct() {
        parent::__construct();
    }

    private function select_day_values($tables, $columns, $to) {
        $this->users_values['day'] = array();
        foreach($tables as $table) {
            $request = <<<HERE
                    SELECT
                        DATE_FORMAT(`toDT`, '%Y-%m-%d') as d,
                        $columns
                    FROM
                        `$table`
                    WHERE
                        `toDT` <= :todt
                    GROUP BY
                        d
                    ORDER BY d DESC
                    LIMIT 7
HERE;
            $result = $this->db->prepare($request);
            $result->bindParam(':todt', $to);
            if (!$result->execute()) return false;
            array_push($this->users_values['day'], array('id' => (int)substr($table, 5), "values" => $result->fetchAll(PDO::FETCH_NUM)));
        }
        return true;
    }

    private function select_week_values($tables, $columns, $to) {
        $this->users_values['week'] = array();
        foreach($tables as $table) {
            $request = <<<HERE
                    SELECT
                        DATE_FORMAT(`toDT`, '%Y-%m-%d') as d,
                        $columns
                    FROM
                        `$table`
                    WHERE
                        `toDT` <= :todt
                    GROUP BY
                        EXTRACT(WEEK FROM `toDT`)
                    ORDER BY d DESC
                    LIMIT 4
HERE;
            $result = $this->db->prepare($request);
            $result->bindParam(':todt', $to);
            if (!$result->execute()) return false;
            array_push($this->users_values['week'], array('id' => (int)substr($table, 5), "values" => $result->fetchAll(PDO::FETCH_NUM)));
        }
        return true;
    }

    private function select_month_values($tables, $columns, $to) {
        $this->users_values['month'] = array();
        foreach($tables as $table) {
            $request = <<<HERE
                    SELECT
                        DATE_FORMAT(`toDT`, '%Y-%m-%d') as d,
                        $columns
                    FROM
                        `$table`
                    WHERE
                        `toDT` <= :todt
                    GROUP BY
                        d
                    ORDER BY d DESC
                    LIMIT 12
HERE;
            $result = $this->db->prepare($request);
            $result->bindParam(':todt', $to);
            if (!$result->execute()) return false;
            array_push($this->users_values['month'], array('id' => (int)substr($table, 5), "values" => $result->fetchAll(PDO::FETCH_NUM)));
        }
        return true;
    }


    public function select_data($ids, $to, $type = null, $field = null) {
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
                $result  = $this->select_day_values($tables, $columns, $to);
                break;
            case 'week':
                $result  = $this->select_week_values($tables, $columns, $to);
                break;
            case 'month':
                $result  = $this->select_month_values($tables, $columns, $to);
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