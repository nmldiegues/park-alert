package pt.codebits.park.alert;

import oauth.signpost.OAuth;
import oauth.signpost.OAuthConsumer;
import oauth.signpost.OAuthProvider;
import oauth.signpost.commonshttp.CommonsHttpOAuthConsumer;
import oauth.signpost.commonshttp.CommonsHttpOAuthProvider;
import pt.codebits.park.alert.twitter.TwitterUtils;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

public class TwitterPrepareRequestActivity extends Activity {
	
	protected class OAuthRequestTokenTask extends AsyncTask<Void, Void, Void> {

		final String TAG = getClass().getName();
		private Context	context;
		private OAuthProvider provider;
		private OAuthConsumer consumer;

		public OAuthRequestTokenTask(Context context,OAuthConsumer consumer,OAuthProvider provider) {
			this.context = context;
			this.consumer = consumer;
			this.provider = provider;
		}

		/**
		 * Retrieve the OAuth Request Token and present a browser to the user to authorize the token.
		 */
		@Override
		protected Void doInBackground(Void... params) {
			
			try {
				Log.i(TAG, "Retrieving request token from Google servers");
				final String url = provider.retrieveRequestToken(consumer, TwitterUtils.OAUTH_CALLBACK_URL);
				Log.i(TAG, "Popping a browser with the authorize URL : " + url);
				Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url)).setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NO_HISTORY | Intent.FLAG_FROM_BACKGROUND);
				context.startActivity(intent);
			} catch (Exception e) {
				Log.e(TAG, "Error during OAUth retrieve request token", e);
			}

			return null;
		}

	}
	
	protected class RetrieveAccessTokenTask extends AsyncTask<Uri, Void, Void> {

		private Context	context;
		private OAuthProvider provider;
		private OAuthConsumer consumer;
		private SharedPreferences prefs;
		
		public RetrieveAccessTokenTask(Context context, OAuthConsumer consumer,OAuthProvider provider, SharedPreferences prefs) {
			this.context = context;
			this.consumer = consumer;
			this.provider = provider;
			this.prefs=prefs;
		}


		/**
		 * Retrieve the oauth_verifier, and store the oauth and oauth_token_secret 
		 * for future API calls.
		 */
		@Override
		protected Void doInBackground(Uri...params) {
			final Uri uri = params[0];
			final String oauth_verifier = uri.getQueryParameter(OAuth.OAUTH_VERIFIER);

			try {
				provider.retrieveAccessToken(consumer, oauth_verifier);

				final Editor edit = prefs.edit();
				edit.putString(OAuth.OAUTH_TOKEN, consumer.getToken());
				edit.putString(OAuth.OAUTH_TOKEN_SECRET, consumer.getTokenSecret());
				edit.commit();
				
				String token = prefs.getString(OAuth.OAUTH_TOKEN, "");
				String secret = prefs.getString(OAuth.OAUTH_TOKEN_SECRET, "");
				
				consumer.setTokenWithSecret(token, secret);
				context.startActivity(new Intent(context, LoginActivity.class));

				executeAfterAccessTokenRetrieval();
				
				Log.i(TAG, "OAuth - Access Token Retrieved");
				
			} catch (Exception e) {
				Log.e(TAG, "OAuth - Access Token Retrieval Error", e);
			}

			return null;
		}


		private void executeAfterAccessTokenRetrieval() {
			TwitterUtils.loginWithTwitter(TwitterPrepareRequestActivity.this, prefs);
		}
	}

	final String TAG = getClass().getName();
	
    private OAuthConsumer consumer; 
    private OAuthProvider provider;
    
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		if(!isNetworkAvailable()){
			Log.i("[TwitterConnect]", "Error connecting: no network");
			Toast.makeText(TwitterPrepareRequestActivity.this, "Não foi possível ligá-lo via Twitter", Toast.LENGTH_LONG).show();
			finish();
		}
    	try {
    		this.consumer = new CommonsHttpOAuthConsumer(TwitterUtils.CONSUMER_KEY, TwitterUtils.CONSUMER_SECRET);
    	    this.provider = new CommonsHttpOAuthProvider(TwitterUtils.REQUEST_URL, TwitterUtils.ACCESS_URL, TwitterUtils.AUTHORIZE_URL);
    	} catch (Exception e) {
    		Log.e(TAG, "Error creating consumer / provider",e);
		}

        Log.i(TAG, "Starting task to retrieve request token.");
		new OAuthRequestTokenTask(this,consumer,provider).execute();
	}

	/**
	 * Called when the OAuthRequestTokenTask finishes (user has authorized the request token).
	 * The callback URL is intercepted here.
	 */
	@Override
	public void onNewIntent(Intent intent) {
		super.onNewIntent(intent); 
		SharedPreferences prefs = getSharedPreferences(ParkAlertActivity.PREFS_NAME, MODE_PRIVATE);
		final Uri uri = intent.getData();
		if (uri != null && uri.getScheme().equals(TwitterUtils.OAUTH_CALLBACK_SCHEME)) {
			Log.i(TAG, "Callback received : " + uri);
			Log.i(TAG, "Retrieving Access Token");
			new RetrieveAccessTokenTask(this,consumer,provider,prefs).execute(uri);
			finish();	
		}
	}
	
	private boolean isNetworkAvailable() {
	    ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
	    NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
	    return activeNetworkInfo != null;
	}
	
}
