# Baceknd-Server API Endpoints
this backend-server is providing template for basic auth based on username and password. the following endpoints can be called
  - /auth/register :  create user in database
  - /auth/login : issues a JWT token to user if credentials are valid
  - /password-reset/request-reset : send an OTP via email, if user is registered. for security purposes, OTP validity is kept 5 minutes only.
  - /password-reset/reset-password : updates password if OTP is valid and not expired.
  ## backend is secured via API KEY mechanism. all incoming request must provide a valid key in order to communicate with server. 

# Database
POSTGRESsql is used as database in this example. 'users' table is created with following attributes. 
    	- id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	- username VARCHAR(50) UNIQUE NOT NULL,
	- password VARCHAR(100) NOT NULL,
	- email VARCHAR(50) UNIQUE NOT NULL,
	- image_path TEXT,
	- ADDRESS VARCHAR(100),
	- Phone VARCHAR(10),
	- Profession VARCHAR(15),
	- otp_secret VARCHAR(10),
  	- otp_expiry TIMESTAMPTZ

# Sources
(This REPO is for demo and tutorial purposes only).
In order to develop the code in REPO, several resources have been followed.
