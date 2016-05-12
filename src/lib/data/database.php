<?php
/**
 * 读取wwww/content目录下的xxtebook.db文件的内容
 * 根据sql返回查询结果
 * PHP version >= 5.1.0, PECL pdo >= 0.1.0
 *
 * @author <[email]>278500368@qq.com
 * @return json
 * @version 2.0
 */

//数据库操作类
class DB {
    //数据连接句柄
    private $_db;
    //单例引用
    private static $_instance;

    private function __construct(){
    	$DSN = '../../content/xxtebook.db';
	    $this->_db = new PDO('sqlite:'.$DSN);
	}

	//初始化数据库连接
	public static function initDB(){
	    if(! (self::$_instance instanceof self)){
        self::$_instance = new self();
	    }
	    return self::$_instance;
  	}

  	//查询数据
  	public function queryAll ($sql){
  		$conn = $this->_db->prepare($sql);
      $conn->setFetchMode(PDO::FETCH_ASSOC);
      $conn->execute();
      return $conn->fetchAll();
  	}

  	//将数据转换成json格式
    public static function dbToJson($arr) {
        if(version_compare(PHP_VERSION, '5.3.3') >= 0){
            //Don't escape the digital part
            return json_encode($arr,JSON_NUMERIC_CHECK);
        }else{
            $arr = json_encode($arr);
            return preg_replace( "/\"(\d+)\"/", '$1', $arr);
        }
    }

    public function __destruct() {
        //$this->_db = null;
        //self::$_instance = null;
    }

    private function __clone(){
		//...
	  }
}

	$db = DB::initDB();

	if(!isset($_GET['xxtsql'])){
		exit();
	}

	$sql = trim($_GET['xxtsql']);

	try{
		$rs = $db->queryAll($sql);
		echo DB::dbToJson($rs);
	}catch(Exception $e){
		//error message
		exit();
	}
?>