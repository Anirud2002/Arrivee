﻿using System;
namespace api.Interfaces
{
	public interface IEmailService
	{
		public Task SendEmailAsync(string senderFirstName, string senderLastName, string senderFeedback, int Stars);
		public Task SendVerificationCodeAsync(int vertificationCode, string emailAddress);
    }
}

