<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="a4c.css">
	<script></script>
	<title>Admin View</title>
</head>
<body>
	<!--codes for the navigation bar-->
	<header>
		<nav>
			<ul id='nav'>
				<li class="logo"><a href="index.html">Carry Me!</a></li>
				<li><a href="login.html">Log out</a></li>
				<li><a href="#panel-in">Games</a></li>
			</ul>
		</nav>
	</header>

	<div class="form">
		<form>
			<span>Edit/Add User with name:</span>
			<input type="text" placeholder="Username" name="username"></input>
			<!-- Include option to delete on profile page? How to distinguish between coach and student? -->
		  	<input type="checkbox" name="adminAction" id="adminActionDelete" value="delete">Delete User</input>
		  	<a href="editstudent.html">
		  		<input type="button" value="Edit Student Profile">
		  	</a>
		  	<a href="editcoach.html">
		  		<input type="button" value="Edit Coach Profile">
		  	</a>
		  	<p>Total Number of Coaches:<p>
			<p>Total Number of Students:<p>
		</form>

	</div>

</body>
</html>
