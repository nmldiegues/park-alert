package pt.codebits.park.alert;

import pt.codebits.park.alert.comm.REST;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;

public class RegisterActivity extends Activity {
    
	private static final String USERNAME_ALREADY_EXISTS = "usernameAlreadyExists";
	private static final String EMAIL_INCORRECT = "emailIncorrect";
	private static final String WRONG_PHONE_NUMBER = "wrongPhoneNumber";
	private static final String JSON_PROBLEMS = "jsonProblems";
	private SharedPreferences mPrefs;
	public static final String PREFS_NAME = "ValuesPreferences";
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.register);

		final Button registerBtn = (Button) findViewById(R.id.registerbtn);

        mPrefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        
        TelephonyManager tMgr =(TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
		final String mPhoneNumber = tMgr.getLine1Number();
		
		final EditText usernameForm = (EditText) findViewById(R.id.utilizadorform);
		final EditText emailForm = (EditText) findViewById(R.id.emailform);
		final EditText passwordForm = (EditText) findViewById(R.id.palavrachaveform);
		final EditText passwordConfirmForm = (EditText) findViewById(R.id.palavrachaveconfirmform);
		final EditText phoneNumberForm = (EditText) findViewById(R.id.phoneform);
		
		if (mPhoneNumber != null && mPhoneNumber.length() != 0) {
			phoneNumberForm.setText(mPhoneNumber);
		}
		
		registerBtn.setOnClickListener(new OnClickListener() {
			private boolean allFieldsFilled() {
				String username = usernameForm.getText().toString();
				String email = emailForm.getText().toString();
				String password = passwordForm.getText().toString();
				String passwordConfirm = passwordConfirmForm.getText().toString();
				String phoneNumber = phoneNumberForm.getText().toString();
				
				if (username == null || username.length() == 0 || email == null || email.length() == 0  
						|| password == null || password.length() == 0 || passwordConfirm == null || 
						passwordConfirm.length() == 0 || phoneNumber == null || phoneNumber.length() == 0) {
					return false;
				}
				
				return true;
			}
			
			private boolean passwordsMatchEachOther() {
				String password = passwordForm.getText().toString();
				String passwordConfirm = passwordConfirmForm.getText().toString();
				if (!password.equals(passwordConfirm)) {
					return false;
				}
				return true;
			}
			
			private void setWarningMessage(final int msgUID) {
				RegisterActivity.this.runOnUiThread(new Runnable() {
					public void run() {
						final android.widget.TextView warningView = (android.widget.TextView) findViewById(R.id.warningMsg);
						warningView.setText(msgUID);
						
						final ProgressBar progressBar = (ProgressBar) findViewById(R.id.progressBar);
						stopProgressBar(progressBar);
						return;
					}
				});
			}
			
			private void stopProgressBar(final ProgressBar progressBar) {
				// Set the progress bar back to invisible and move on to next activity
				RegisterActivity.this.runOnUiThread(new Runnable(){
					public void run() {
						progressBar.setVisibility(View.INVISIBLE);
					}
				});
			}	
			
			public void onClick(View v) {
				
				final android.widget.TextView warningView = (android.widget.TextView) findViewById(R.id.warningMsg);
				// Test if the form is correctly filled in
				if (!allFieldsFilled()) {
					warningView.setText(R.string.fillFields);
					return;
				}
				
				if (!passwordsMatchEachOther()) {
					passwordForm.setText("");
					passwordConfirmForm.setText("");
					warningView.setText(R.string.mismatchPasswords);
					return;
				}

				// Make the progress bar visible (changing UI, need the UI thread)
				final ProgressBar progressBar = (ProgressBar) findViewById(R.id.progressBar);
				RegisterActivity.this.runOnUiThread(new Runnable() {
					public void run() {
						progressBar.setVisibility(View.VISIBLE);
					}
				});
				
				// Run the register request asynchronously, the UI thread remains responsive
				// and the progress bar is spinning
				new Thread() {
					public void run() {						
						// This request is blocking in this concurrent Thread
						String result = REST.registerUser(RegisterActivity.this, usernameForm.getText().toString(),
								passwordForm.getText().toString(), emailForm.getText().toString(), phoneNumberForm.getText().toString());
						if (REST.checkForStopConditions(RegisterActivity.this, result)) {
							return;
						}
						
						if (result.equals(USERNAME_ALREADY_EXISTS)) {
							setWarningMessage(R.string.usernameInUse);
							return;
						} else if (result.equals(EMAIL_INCORRECT)) {
							setWarningMessage(R.string.emailWrong);
							return;
						} else if (result.equals(WRONG_PHONE_NUMBER)) {
							setWarningMessage(R.string.wrongNumber);
							return;
						} else if (result.equals(JSON_PROBLEMS)) {
							setWarningMessage(R.string.jsonProblems);
							return;
						}
						
						setWarningMessage(R.string.empty);
						
						String token = REST.loginUser(RegisterActivity.this, usernameForm.getText().toString(), passwordForm.getText().toString());
						if (REST.checkForStopConditions(RegisterActivity.this, token)) {
							return;
						}
						
						SharedPreferences.Editor editor = mPrefs.edit();
						editor.putString("regular_access_token", token);
		                editor.commit(); 
						
						stopProgressBar(progressBar);

						MainMapActivity.redirectToLogin(RegisterActivity.this);
					}

				}.start();

			}
		});
		
		final ImageButton fbBtn = (ImageButton) findViewById(R.id.fbbtn);
		fbBtn.setOnClickListener(new OnClickListener() {

			public void onClick(View v) {
				Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
				intent.putExtra("registerFB", true);
				RegisterActivity.this.startActivity(intent);
				RegisterActivity.this.finish();
			}
		});
		
		final ImageButton twitterBtn = (ImageButton) findViewById(R.id.twitterbtn);
		twitterBtn.setOnClickListener(new OnClickListener() {

			public void onClick(View v) {
				Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
				intent.putExtra("registerTwitter", true);
				RegisterActivity.this.startActivity(intent);
				RegisterActivity.this.finish();
			}
		});

	}
	
}
