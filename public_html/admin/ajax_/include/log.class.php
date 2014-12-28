<?php

include_once '../../../conf/conf.php';

class LOGTYPES {
    const ERROR = 'ERROR';
    const CRITICAL = 'CRITICAL';
    const WARNING = 'WARNING';
    const INFO = 'INFO';
}

class Log {
    private $descr;

    function __construct($file = LOG_FILE) {
        if (!$this->descr = fopen('../../../' . $file, 'a+')) {
            header('HTTP/1.0 500 Internal Server Error');
            exit();
        }

        date_default_timezone_set(TIME_ZONE);
    }

    public function write($message, $type = LOGTYPES::INFO) {
        return fwrite($this->descr, '[' . $type . ']: ' . $message . ' /' . date('Y-m-d H:i:s') . '/' . PHP_EOL) === true;
    }

    function __destruct() {
        fclose($this->descr);
    }
}

?>