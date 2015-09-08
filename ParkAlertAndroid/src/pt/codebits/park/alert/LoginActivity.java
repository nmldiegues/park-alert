package pt.codebits.park.alert;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;

import org.json.JSONException;
import org.json.JSONObject;

import com.facebook.android.AsyncFacebookRunner;
import com.facebook.android.AsyncFacebookRunner.RequestListener;
import com.facebook.android.DialogError;
import com.facebook.android.Facebook;
import com.facebook.android.FacebookError;
import com.facebook.android.Facebook.DialogListener;
import com.facebook.android.Util;

import pt.codebits.park.alert.R;
import pt.codebits.park.alert.comm.REST;
import pt.codebits.park.alert.twitter.TwitterUtils;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

public class LoginActivity extends Activity {

	private final class AuthorizationListener implements DialogListener {
		public void onComplete(Bundle values) {
			SharedPreferences.Editor editor = mPrefs.edit();
			editor.putString("fb_access_token", mFacebook.getAccessToken());
			editor.putLong("fb_access_expires", mFacebook.getAccessExpires());
			editor.commit();
			loginWithFacebook();
		}

		public void onFacebookError(FacebookError error) {
			reportError(error);
		}

		public void onError(DialogError e) {
			reportError(e);
		}

		public void onCancel() {}

		private void reportError(Throwable tr) {
			Log.e("[FacebookConnect]", "Error connecting: ", tr);
			Toast.makeText(LoginActivity.this, "Não foi possível ligá-lo via Facebook", Toast.LENGTH_LONG).show();
		}
	}

	// Hard-coded because we cannot get strings before the activity is initialized, what a pain!
	protected final Facebook mFacebook = new Facebook("414209645276563");
	protected final AsyncFacebookRunner mAsyncRunner = new AsyncFacebookRunner(mFacebook);

	private SharedPreferences mPrefs;
	public static final String PREFS_NAME = "ValuesPreferences";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		// Get existing access_token if any
		mPrefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
		String access_token = mPrefs.getString("fb_access_token", null);
		long expires = mPrefs.getLong("fb_access_expires", 0);
		if(access_token != null) {
			mFacebook.setAccessToken(access_token);
		}
		if(expires != 0) {
			mFacebook.setAccessExpires(expires);
		}

		if (mFacebook.isSessionValid()) {
			loginWithFacebook();
		}
		else if(TwitterUtils.isAuthenticated(mPrefs)){
			TwitterUtils.loginWithTwitter(LoginActivity.this, mPrefs);
		}

		setContentView(R.layout.login);

		final Button loginBtn = (Button) findViewById(R.id.loginbtn);
		final Button registerBtn = (Button) findViewById(R.id.registerbtn);

		loginBtn.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {

				final EditText userForm = (EditText) findViewById(R.id.utilizadorform);
				final EditText pwForm = (EditText) findViewById(R.id.palavrachaveform);

				final android.widget.TextView warningView = (android.widget.TextView) findViewById(R.id.warningMsg);
				// Verify if the form is correctly filled in
				if (userForm.getText().toString().equals("") || pwForm.getText().toString().equals("")) {
					warningView.setText(R.string.fillFields);
					return;
				}

				new Thread() {
					@Override
					public void run() {
						String token = REST.loginUser(LoginActivity.this, userForm.getText().toString(), pwForm.getText().toString());
						if (REST.checkForStopConditions(LoginActivity.this, token)) {
							return;
						}

						SharedPreferences.Editor editor = mPrefs.edit();
						editor.putString("regular_access_token", token);
						editor.commit();

						LoginActivity.this.runOnUiThread(new Runnable() {
							public void run() {
								Intent intent = new Intent(LoginActivity.this, MainMapActivity.class);
								intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
								LoginActivity.this.startActivity(intent);
								LoginActivity.this.finish();
							}
						});

					}
				}.start();

			}
		});
		registerBtn.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
				Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
				intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				LoginActivity.this.startActivity(intent);
				LoginActivity.this.finish();
			}
		});

		final ImageButton fbBtn = (ImageButton) findViewById(R.id.fbbtn);
		fbBtn.setOnClickListener(new OnClickListener() {

			public void onClick(View v) {
				if(!mFacebook.isSessionValid()) {
					mFacebook.authorize(LoginActivity.this, new String[] {"user_about_me", "email"}, new AuthorizationListener());
				}
			}
		});
		
		final ImageButton twitBtn = (ImageButton) findViewById(R.id.twitterbtn);
		twitBtn.setOnClickListener(new OnClickListener() {
			
			public void onClick(View v) {
				if (!TwitterUtils.isAuthenticated(mPrefs)) {
    				Intent i = new Intent(getApplicationContext(), TwitterPrepareRequestActivity.class);
    				startActivity(i);
            	}
			}
		});

	}


	private void loginWithFacebook() {
		mAsyncRunner.request("me", new RequestListener(){

			public void onComplete(final String response, final Object state) {
				// Since we are not sure which Thread may serve this callback of the 
				// facebook SDK, we must conservatively run it in a concurrent Thread
				// to ensure we do not block the UI thread
				new Thread() {
					@Override
					public void run() {
						JSONObject json = null;
						String id = null;
						String name = null;
						String email = null;
						try {
							json = Util.parseJson(response);
							id = json.getString("id");
							name = json.getString("name");
							email = json.getString("email");
						} catch (FacebookError e) {
							mFacebook.authorize(LoginActivity.this, new String[] {"user_about_me", "email"}, new AuthorizationListener());
							return;
						} catch (JSONException e) {
							mFacebook.authorize(LoginActivity.this, new String[] {"user_about_me", "email"}, new AuthorizationListener());
							return;
						}
						String result = REST.loginFacebook(LoginActivity.this, id, name, email);
						if (REST.checkForStopConditions(LoginActivity.this, result)) {
							return;
						}

						SharedPreferences.Editor editor = mPrefs.edit();
						editor.putString("regular_access_token", result);
						editor.commit();

						MainMapActivity.redirectToLogin(LoginActivity.this);
					}
				}.start();
			}

			public void onIOException(IOException e, Object state) {
				reportError(e);
			}

			public void onFileNotFoundException(FileNotFoundException e,
					Object state) {
				reportError(e);
			}

			public void onMalformedURLException(MalformedURLException e,
					Object state) {
				reportError(e);
			}

			public void onFacebookError(FacebookError e, Object state) {
				mFacebook.authorize(LoginActivity.this, new String[] {"user_about_me", "email"}, new AuthorizationListener());
			}

			private void reportError(Throwable tr) {
				Log.e("[FacebookConnect]", "Error connecting: ", tr);
				Toast.makeText(LoginActivity.this, "Não foi possível ligá-lo via Facebook", Toast.LENGTH_LONG).show();
			}

		});
	}

	@Override
	public void onResume() {    
		super.onResume();
		mFacebook.extendAccessTokenIfNeeded(this, null);
		
		if (getIntent().getBooleanExtra("registerFB", false)) {
			mFacebook.authorize(LoginActivity.this, new String[] {"user_about_me", "email"}, new AuthorizationListener());
		}
		else if(getIntent().getBooleanExtra("registerTwitter", false)){
			Intent i = new Intent(getApplicationContext(), TwitterPrepareRequestActivity.class);
			startActivity(i);
		}
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);

		mFacebook.authorizeCallback(requestCode, resultCode, data);
	}

	public static void redirectToLogin(final Activity activity) {
		activity.runOnUiThread(new Runnable(){
			public void run() {
				Intent intent = new Intent(activity, LoginActivity.class);
				intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				activity.startActivity(intent);
				// remove this activity from the stack
				activity.finish();
			}
		});
	}

}
