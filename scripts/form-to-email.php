<?php

require_once('PHPMailer/src/PHPMailer.php');
require_once('PHPMailer/src/SMTP.php');

if(!isset($_POST['submit']))
{
	echo "error; you need to submit the form!";
}
$name = $_POST['name'];
$phone = $_POST['phone'];

if(empty($name)||empty($phone))
{
    echo "Name and email are mandatory!";
    exit;
}

$mail = new PHPMailer\PHPMailer\PHPMailer();
$mail->IsSMTP();

$mail->SMTPDebug = 1;
$mail->SMTPAuth = true;
$mail->SMTPSecure = 'ssl';
$mail->Host = "smtp.gmail.com";
$mail->Port = 465;
$mail->IsHTML(true);
$mail->Username = "gpods018@gmail.com";
$mail->Password = "PodsForSale";
$mail->SetFrom("no-reply@howcode.com");
$mail->Subject = "Test";
$mail->Body = $name . '\n' . $phone;
$mail->AddAddress("mr.kikimer95@gmail.com");

 if(!$mail->Send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
 } else {
    echo "Message has been sent";
 }
?>
