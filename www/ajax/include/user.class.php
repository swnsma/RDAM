<?php

include "connection.class.php";

class User extends Connection {
    private $result;
    private $request;

    function __construct() {
        parent::__construct();
    }

    private function select_year_data($id, $from) {
        $this->request = <<<HERE
            SELECT
                EXTRACT(YEAR FROM `fromDT`) as d,
                SUM(`production`) as p,
                SUM(`consumption`) as c
            FROM
                `mytable`
            WHERE
                `fromDT` >= '$from'
            GROUP BY
                d
            ORDER BY
                d
            LIMIT 10
HERE;
    }

    private function select_month_data($id, $from) {
        $this->request = <<<HERE
            SELECT
                EXTRACT(MONTH FROM `fromDT`) as d,
                SUM(`production`) as p,
                SUM(`consumption`) as c
            FROM
                `mytable`
            WHERE
                `fromDT` >= '$from'
            GROUP BY
                d
            ORDER BY
                d
            LIMIT 12
HERE;
    }

    private function select_day_data($id, $from) {
        $this->request = <<<HERE
            SELECT
                `production` as p,
                `consumption` as c,
                `fromDT` as d
            FROM
                `mytable`
            WHERE
                `fromDT` >= '$from'
            LIMIT 7
HERE;
    }

    public function select_data($type, $id, $from) {
        switch($type) {
            case 1:
                $this->select_day_data($id, $from);
            break;
            case 2:
                $this->select_month_data($id, $from);
                break;
            case 3:
                $this->select_year_data($id, $from);
                break;
            default:
                return false;
            break;
        }
        $this->result = $this->db->query($this->request);
        return $this->result;
    }

    public function print_data() {
        $data = $this->result->fetchAll(PDO::FETCH_ASSOC);
        $size = count($data)-1;
        if ($size >= 0) {
            print '[ ';
            for($i = 0; $i < $size; ++$i) {
                print '[ "' . $data[$i]['p'] .
                    '", "' . $data[$i]['c'] .
                    '", "' . $data[$i]['d'] .
                    '" ], ';
            }
            print '[ "' . $data[$size]['p'] .
                '", "' . $data[$size]['c'] .
                '", "' . $data[$i]['d'] .
                '" ] ]';
        } else {
            print '[ ]';
        }
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>