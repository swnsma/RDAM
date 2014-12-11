<?php

include "users.class.php";

class UsersValues extends Users {
    private  $users_values = array();

    function __construct() {
        parent::__construct();
    }

    public function select_data($ids, $type, $to, $field = null) {
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

        foreach($tables as $table) {
            switch($type) {
                case 'day':
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
                    break;
                case 'week':
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
                    break;
                case 'month':
                    $request = <<<HERE
                    SELECT
                        DATE_FORMAT(`toDT`, '%Y-%m') as d,
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
                    break;
                default:
                    return false;
                    break;
            }

            $result = $this->db->prepare($request);
            $result->bindParam(':todt', $to);
            if(!$result->execute())
                break;
            $this->users_values[substr($table, 5)] = $result->fetchAll(PDO::FETCH_NUM);
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