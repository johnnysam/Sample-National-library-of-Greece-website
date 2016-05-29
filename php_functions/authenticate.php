<?php

	session_start();
	$user   = $_POST["username"];
	$passwd = $_POST["password"];

	if ($user == "lakis" && $passwd == "lalakis"){
		echo "Right!";
		$_SESSION['logged_user'] = $user;
		unset($_SESSION["login_message"]);
		$redirect = "../index.php";
	}
	else{
		echo "Wrong username/passwd";
		$_SESSION['login_message'] = "Το όνομα χρήστη ή/και ο κωδικός πρόσβασης 
		είναι λανθασμένος";
		$redirect = "../signin.php";
	}
		
		
?>

<html>
	<head>	
	<meta HTTP-EQUIV="REFRESH" content="0; url=<?php echo $redirect;?>" />
	</head>
	<body>
	</body>
</html>
