using System;
namespace api.Interfaces
{
	public interface IEmailService
	{
		public Task SendEmail(string senderEmailAddress, string senderFirstName, string senderLastName, string senderFeedback);

    }
}

