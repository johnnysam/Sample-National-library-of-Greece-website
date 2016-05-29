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
			<li><a href="./info">Πληροφορίες</a></li>
    			<li>Αναγνωστήρια</li>
    			</ul>
		</div>

<!-- INSIDE BODY -->
		<div id=inside_body_title >
			Πληροφορίες για τα Αναγνωστήρια




		</div>
		<div id="inside_body_center">



			
		</div>
		<div id="inside_body_title2">
			Δικαίωμα εισόδου και χρήσης του Αναγνωστηρίου
		</div>
		<div id=inside_body_small >
Δικαίωμα εισόδου και χρήσης του Αναγνωστηρίου έχουν όσοι έχουν συμπληρώσει το 18ο έτος της ηλικίας τους και διαθέτουν Δελτίο Αναγνώστη.
<br>
Το Δελτίο Αναγνώστη εκδίδεται από την ΕΒΕ, για τους αναγνώστες που έχουν ανάγκη να χρησιμοποιήσουν τη Βιβλιοθήκη, έπειτα από αίτηση του ενδιαφερομένου, με προσκόμιση δύο φωτογραφιών και της αστυνομικής ταυτότητας.
<br>
Το Δελτίο εκδίδεται δωρεάν από την ΕΒΕ, είναι απολύτως προσωπικό και ισχύει για πέντε χρόνια. Σε περίπτωση που απολεσθεί, ο κάτοχός του πρέπει να το αναφέρει στην ΕΒΕ, που του το αντικαθιστά άλλως είναι υπεύθυνος για κάθε κακή χρήση της βιβλιοθήκης από εκείνον που θα το χρησιμοποιήσει.
Για περιπτώσεις που ο αναγνώστης πρόκειται να χρησιμοποιήσει τη Βιβλιοθήκη για μια συγκεκριμένη μόνο έρευνα, ή είναι μόνιμος κάτοικος άλλης πόλης ή χώρας, εκδίδεται Προσωρινή άδεια εισόδου, που ισχύει από μια έως δέκα ημέρες.
<br>
<br>
Για την απόκτηση Δελτίου Αναγνώστη ακολουθήστε τον σύνδεσμο: <a href="./">Αίτηση Δελτίου Αναγνώστη</a>
		</div>
		<div id="inside_body_title2">
		Ωράριο λειτουργίας Κεντρικού Αναγνωστηρίου
		</div>
		<div id=inside_body_small2 >

			<table class="table_info" width="70%" align=”left” cellspacing="2" border="2">
				<tr class="row1">
					<td>Δευτέρα</td>
					<td>Τρίτη</td>
					<td>Τετάρτη</td>
					<td>Πέμπτη</td>
					<td>Παρασκευή</td>
					<td>Σάββατο</td>
				</tr>
				<tr>
					<td>9:00 - 20:00</td>
					<td>9:00 - 20:00</td>
					<td>9:00 - 20:00</td>
					<td>9:00 - 20:00</td>
					<td>9:00 - 14:00</td>
					<td>9:00 - 14:00</td>
				</tr>
			</table>
		</div>

		<div id="inside_body_title2">
		Ωράριο λειτουργίας Αναγνωστηρίου Χειρόγραφων
		</div>
		<div id=inside_body_small2 >

			<table class="table_info" width="70%" align=”left” cellspacing="5" border="2">
				<tr class="row1">
					<td>Δευτέρα</td>
					<td>Τρίτη</td>
					<td>Τετάρτη</td>
					<td>Πέμπτη</td>
					<td>Παρασκευή</td>
					<td>Σάββατο</td>
				</tr>
				<tr>
					<td>9:00 - 14:00</td>
					<td>9:00 - 14:00</td>
					<td>9:00 - 14:00</td>
					<td>9:00 - 14:00</td>
					<td>9:00 - 14:00</td>
					<td>Κλειστό</td>
				</tr>
			</table>

		</div>
		







			
		

		

	</div> <!-- End of div container -->

<!-- BOTTOM FOOTER -->

	<div id="footer" >
	Πανεπιστημίου 32, Αθήνα
	</div>




</body>
</html>

