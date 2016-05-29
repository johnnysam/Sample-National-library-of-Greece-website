<?php
	session_start();
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Εθνική Βιβλιοθήκη της Ελλάδας</title>

	<link href="css/helper.css" media="screen" rel="stylesheet" type="text/css" />
	<link href="css/dropdown.css" media="screen" rel="stylesheet" type="text/css" />
	<link href="css/default.css" media="screen" rel="stylesheet" type="text/css" />
	<link href="css/main.css" media="screen" rel="stylesheet" type="text/css" />
</head>



<body >

	<div id="container" >

<!-- MAIN LAYOUT -->
	
	<div id="main" >

<!-- LOGO TOP LEFT -->

		<div id="icon" >
		<a href="./index.php" >
		<img id="main_img" src="images/library-27.png" title="Go to the home page" >
		</a>
		</div>
	
	
		<div id="title" >
		<a id="main_title" href="./index.php" >
		<strong>Εθνική Βιβλιοθήκη της Ελλάδας</strong>
		</a>
		</div>


		 <div id="login" > 
		 	 <?php
		 	 	if (isset($_SESSION['logged_user'])){
		 	 		$user = $_SESSION['logged_user'];
		 	 		echo "Καλωσόρισες, $user<br/>
		 	 		<a href='./edit_profile.php'>Επεξεργασία προφίλ</a></br>
		 	 		<a href='./lend_list.php'>Τι έχω δανειστει</a></br>
		 	 		<a href=''>Η λίστα μου</a></br>
		 	 		<a href='./php_functions/logout.php'>Αποσύνδεση</a>";
		 	 	}
		 	 else{
		 	 echo"
			 <form action='./php_functions/authenticate.php' method='post'>
			 <input type='text' name='username' placeholder='Όνομα χρήστη'>
			 <input type='password' name='password' placeholder='Κωδικός πρόσβασης'><br>
			 <input type='submit' name='enter' value='  Σύνδεση  '>
			 </form>
			 <a style='font-size:14px' href='./signup.php'>Εγγραφή</a><br>";
			 }
		?>
		 </div>
		 


<!-- MENU -->
		 	
<div id="menu" >

<ul id="nav" class="dropdown dropdown-horizontal">
	<li><a href="./index.php">Αρχική</a></li>
	<li><span class="dir">Πληροφορίες</span>
		<ul>
			<li><a href="./info_anagn.php">Αναγνωστήρια</a></li>

			<li><a href="">Ιστορικά στοιχεία</a></li>
			<li><a href="">Το όραμα μας</a></li>
			<li><a href="">Κανονισμοί</a></li>
			<li><a href="">Site map</a></li>

			<li><a href="">Συχνές ερωτήσεις(FAQs)</a></li>
		</ul>
	</li>
	<li><span class="dir">Υπηρεσίες</span>
		<ul>
			<li><a href="">Αναγνωστήρια</a></li>
			<li><span class="dir">Εθνικό κέντρο ISBN/ISSN/ISMN</span>
				<ul>
					<li><a href="">Ωράριο λειτουργίας</a></li>
					<li><a href="">Κατάλογος εκδοτών</a></li>
					<li><a href="">Χορήγηση ISBN</a></li>

					<li><a href="">Χορήγηση ISSN</a></li>
					<li><a href="">Χορήγηση ISMN</a></li>
				</ul>
			</li>
			<li><a href="">Ελληνική βιβλιογραφία</a></li>
			<li><a href="">Καταθέσεις εντύπων</a></li>
			<li><a href="">Φωτοτύπηση</a></li>
		</ul>
	</li>
	<li><span class="dir">Κατάλογοι</span>

		<ul>
			<li><a href="./catalogs.php">Δημόσιος κατάλογος</a></li>

			<li><a href="">Κατάλογος χειρογράφων</a></li>
			<li><a href="">Κατάλογος Ελλήνων εκδοτών</a></li>
		</ul>
	</li>
	<li><a href="">Εκθέσεις</a></li>
	<li><a href="">Δελτία τύπου</a></li>

	<li><a href="" class="dir">Επικοινωνία</a>
		<ul>
			<li><a href="">Στοιχεία επικοινωνίας</a></li>
			<li><a href="">Προτάσεις-Υποδείξεις</a></li>
			<li><a href="">Χάρτης πρόσβασης</a></li>
		</ul>

	</li>
</ul>

<br>
</div>
	

<!-- SEARCH BAR -->

		<div id="search_bar" > 
			<form action="search_results.php" method="post">
			<input style="font-size:18px"
			type="text" name="myTextBox" placeholder="Ψάξε ότι θες">
			<input type="submit" name="mySearch" value=" Αναζήτηση ">
			<br>
			<input type="radio" name="rad" value="database" checked>database
			<input type="radio" name="rad" value="nlg.gr">nlg.gr
			<a href="./advanced_search.php">Σύνθετη Αναζήτηση</a>
			</form>
		</div>

	</div> <!-- End of div main -->

<!-- BREADCRUMB -->
		<div id="breadcrumb" >
			<ul id="breadcrumbs">
			<li><a href="./index.php">Αρχική</a></li>
    			<li>Επεξεργασία προφίλ</li>
    			</ul>
		</div>

<!-- INSIDE BODY -->
		<div id=inside_body_title >
			Επεξεργασία προφίλ
		</div>

		
		<div id=inside_body >
			<form action="func.php" method="post">
			<div id="inside_body_center">
			<strong>Προσωπικά στοιχεία</strong>
			</div>
			Όνομα Χρήστη:   
			<input type="text" name="username">
			<br>
			<br>
			Όνομα:   
			<input type="text" name="name">
			<br>
			<br>
			Επώνυμο:   
			<input type="text" name="prename">
			<br>
			<br>
			Διεύθυνση:   
			<input type="text" name="prename">
			<br>
			<br>
			Πόλη:   
			<input type="text" name="prename">
			<br>
			<br>
			Τηλέφωνο:   
			<input type="text" name="prename">
			<br>
			<br>
			Ημερομηνία γέννησης (ΗΗ/ΜΜ/ΕΕΕΕ):   
			<input type="text" name="prename">
			<br>
			<br>
			Επάγγελμα/Ιδιότητα:   
			<input type="text" name="prename">
			<br>
			<br>
			<div id="inside_body_center">
			<strong>Στοιχεία πρόσβασης και επικοινωνίας</strong>
			</div>
			Παλιός Κωδικός Πρόσβασης:
			<input type="password" name="password">
			<br>
			<br>
			Νέος Κωδικός Πρόσβασης:
			<input type="password" name="password">
			<br>
			<br>
			Επαλήθευση νέου κωδικού πρόσβασης:
			<input type="password" name="password_check">
			<br>
			<br>
			Νέα Ηλεκτρονική διεύθυνση:
			<input type="text" name="email">
			<br>
			<br>
			Επαλήθευση νέας ηλεκτρονικής διεύθυνσης:
			<input type="text" name="email_check">
			<br>
			<br/>
			Εγγραφή/Απεγγραφή στο newsletter
			<input type="checkbox" name="newsletter" value="yes" checked>
			<br/>
			<br/>
			<div id="inside_body_center">
			(*Δεν είστε υποχρεωμένοι να συμληρώσετε όλα τα πεδία. Όσα συμπληρώσετε θα αλλάξουν στο προφίλ.)
			</div>
			<br>
			<br/><input type="submit" name="Button" value="    Καταγραφή αλλαγών    ">
			</form>
			
		</div>
		
		<div id=error>
			<?php
		 	 	if (isset($_SESSION["signup_message"])){
		 	 		echo $_SESSION["signup_message"];
		 	 	}
		 	 ?>
		 </div><br/>

			
		

		

	</div> <!-- End of div container -->

<!-- BOTTOM FOOTER -->

	<div id="footer" >
	Πανεπιστημίου 32, Αθήνα
	</div>




</body>
</html>

