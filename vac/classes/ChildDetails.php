<?php
class ChildDetails
{
	private $db;
	public function __construct($db)
	{ 			
		$this->db = $db;	
	}
	public function getChildDetails($arr){
		$result = $this->db->query("SELECT * FROM  child_details WHERE  birth_date= :birth_date AND parent_id = :parent_id",$arr);
		return $result;
	}
	public function searchChildDetails($id=""){
		if($id){
			$array = array("doc_id"=>$id);
			$result = $this->db->query("SELECT * FROM  child_details WHERE child_id = :id",$array);
		}else{
			$result = $this->db->query("SELECT * FROM  child_details");
		}
		return $result;
	}
	public function updateChildDetails($arr){
		//$arr 	=  array("doc_name"=>"msikwal","doc_id"=>"1")
		$update	=  $this->db->query("UPDATE child_details SET child_name = :child_name WHERE child_id = :child_id",$arr); 
		return $update;
	}
	public function insertChildDetails($arrInput){
		try{
			
			$arr 	=  array(
						"child_name"=>$arrInput['childern_name'],
						"birth_date"=>$arrInput['birth_date'],
						"parent_id"=>$arrInput['parentId'],
						"gender" =>$arrInput['gender']
			);
			$inputSel 	=  array(
						"birth_date"=>$arrInput['birth_date'],
						"parent_id"=>$arrInput['parentId']
			);
			$userDetails = $this->getChildDetails($inputSel);			
			if(is_array($userDetails) && sizeof($userDetails)>0){
				return 2;
			}else{
				$insert	 =  $this->db->query("INSERT INTO child_details(child_name,birth_date,parent_id,gender) VALUES(:child_name,:birth_date,:parent_id,:gender)",$arr); 		
								
				$result = $this->db->query("SELECT * FROM  vac_details");
				$createVacArr = array();
				if(is_array($result)){
					$length = sizeof($result);
					$birthDate  = strtotime($arr['birth_date']);
					for($i=0;$i<$length;$i++){
						$vacId = $result[$i]['vac_id'];
						$vacName = $result[$i]['vac_name'];
						$effctiveFor = $result[$i]['effctive_for'];
						$start_month = $result[$i]['start_month'];
						$end_month = $result[$i]['end_month'];
						
						$addStartMonth = "+".$start_month." month";
						if($start_month===$end_month){
							$days =  ($end_month*30) + 30;  
							$addEndMonth = "+ ".$days." day";
						}else{
							$addEndMonth = "+".$end_month." month";
						}	
									
						$vacStartDate 	 = date("Y-m-d",strtotime($addStartMonth,$birthDate));
						$vacEndDate 	 = date("Y-m-d",strtotime($addEndMonth,$birthDate));
						$createVacArr[$i] = array(
							'user_id' => $arr['parent_id'],
							'vac_id' => $vacId,
							'msg_type' => 'child',
							'start_date'=> $vacStartDate,
							'end_date' => $vacEndDate
								
						);
					}
				}
				
				for($i=0;$i<sizeof($createVacArr);$i++){
					$inputArr = $createVacArr[$i];
					$insertVac  =  $this->db->query("INSERT INTO msg_schedule_master(user_id,vac_id,msg_type,start_date,end_date) VALUES(:user_id,:vac_id,:msg_type,:start_date,:end_date)",$inputArr); 
				}
				return $insert;
			}
			
		}catch(Exception $e) {
			echo 'Caught exception: ',  $e->getMessage(), "\n";
		}
		
	}
}
?>