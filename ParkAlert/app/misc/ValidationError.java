package misc;

public enum ValidationError {

	USERNAME_EMPTY("", "reg_username_elm", "Preencha o username"),
	PASSWORD_EMPTY("", "reg_password_elm", "Preencha a password"),
	USERNAME_ALREADY_EXISTS("usernameAlreadyExists", "reg_username_elm", "O username já está em uso"),
	EMAIL_INCORRECT("emailIncorrect", "reg_email_elm", "O email está errado"),
	PHONE_NUMBER_INCORRECT("wrongPhoneNumber", "reg_cellphone_elm", "O número de telefone está errado");
	
	private final String androidError;
	private final String field;
	private final String message;
	
	private ValidationError(String androidError, String field, String message) {
		this.androidError = androidError;
		this.field = field;
		this.message = message;
	}
	
	public String getMessage() {
		return this.message;
	}
	
	public String getField() {
		return this.field;
	}
	
	public String getAndroidError() {
		return this.androidError;
	}
}
