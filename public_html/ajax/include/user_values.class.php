<?php

include "users.class.php";

class UserValues extends Users {

    function __construct() {
        parent::__construct();
    }

    public function select_data($type, $id, $to) {
        $table = 'user_' . $id;
        switch($type) {
            case 'day':
                $request = <<<HERE
                    SELECT
                        DATE_FORMAT(`toDT`, '%Y-%m-%d') as d,
                        SUM(`production`) as p,
                        SUM(`consumption`) as c
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
                        EXTRACT(WEEK FROM `toDT`) as w,
                        DATE_FORMAT(`toDT`, '%Y-%m-%d') as d,
                        SUM(`production`) as p,
                        SUM(`consumption`) as c
                    FROM
                        `$table`
                    WHERE
                        `toDT` <= :todt
                    GROUP BY
                        w
                    ORDER BY d DESC
                    LIMIT 12
HERE;
                break;
            case 'month':
                $request = <<<HERE
                    SELECT
                        DATE_FORMAT(`toDT`, '%Y-%m') as d,
                        SUM(`production`) as p,
                        SUM(`consumption`) as c
                    FROM
                        `$table`
                    WHERE
                        `toDT` <= :todt
                    GROUP BY
                        d
                    ORDER BY d DESC
                    LIMIT 10
HERE;
                break;
            default:
                return false;
            break;
        }
        if ($this->check_user_exists($id)) {
            $this->result = $this->db->prepare($request);
            $this->result->bindParam(':todt', $to);
            return $this->result->execute();
        } else {
            return false;
        }
    }

    public function get_data() {
        return $this->result->fetchAll(PDO::FETCH_NUM);
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>