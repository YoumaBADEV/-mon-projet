<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
   // return view('welcome');
   Mail::raw('This is a test email.', function ($message) {
       $message->to('bayoumaaisse304@gmail.com')->subject('Test Email');
   });
   return 'Email sent successfully!';
});
