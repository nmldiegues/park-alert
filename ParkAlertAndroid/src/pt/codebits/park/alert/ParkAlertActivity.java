package pt.codebits.park.alert;

import pt.codebits.park.alert.comm.Authentication;
import pt.codebits.park.alert.comm.REST;
import pt.codebits.park.alert.sms.SmsService;
import pt.codebits.park.alert.twitter.TwitterUtils;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.AnimationDrawable;
import android.os.Bundle;
import android.widget.ImageView;

public class ParkAlertActivity extends Activity {

	private SharedPreferences mPrefs;
	public static final String PREFS_NAME = "ValuesPreferences";

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		setContentView(R.layout.loadingscreen);  
		final ImageView imageView = (ImageView) findViewById(R.id.blankImageView);   
		imageView.setBackgroundResource(R.drawable.loadinganim);   

		imageView.setImageResource(R.drawable.loadinganim);
		imageView.post(new Runnable() {
			public void run() {             
				AnimationDrawable animationDrawable = (AnimationDrawable)imageView.getDrawable();
				animationDrawable.start();
			}
		});
		
		startService(new Intent(this, SmsService.class));

		mPrefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);

		new Thread() {
			public void run() {

				//if found something on SharedPreferences, go to MainMapActivity. If not, go to LoginActivity
				if(mPrefs.contains("fb_access_token") || mPrefs.contains(TwitterUtils.PREFS_OAUTH_TOKEN) || mPrefs.contains("regular_access_token")) {

					String token = mPrefs.getString("regular_access_token", "");
					if (!token.equals("")) {
						// There is a normal token, let's revalidate it
						String result = REST.revalidateToken(ParkAlertActivity.this, Authentication.getTokenId(token), Authentication.getTokenValue(token));
						if (REST.checkForStopConditions(ParkAlertActivity.this, result)) {
							return;
						}
					}
					
					// get the state from the server (if the user has a car parked, etc etc)
					
					ParkAlertActivity.this.runOnUiThread(new Runnable() {
						public void run() {
							Intent intent = new Intent(ParkAlertActivity.this, MainMapActivity.class);
							intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
							ParkAlertActivity.this.startActivity(intent);
							// remove this activity from the stack
							ParkAlertActivity.this.finish();
						}
					});

				}
				else {
					LoginActivity.redirectToLogin(ParkAlertActivity.this);
				}

			}
		}.start();
	}

	@Override
	public void onWindowFocusChanged(boolean hasFocus) {
		super.onWindowFocusChanged(hasFocus);
		//yourAnimation.start();
	}

}