package pt.codebits.park.alert.twitter;


import android.app.Activity;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.Toast;
import oauth.signpost.OAuth;
import pt.codebits.park.alert.MainMapActivity;
import pt.codebits.park.alert.comm.REST;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.User;
import twitter4j.auth.AccessToken;

public abstract class TwitterUtils {
	
	public static final String CONSUMER_KEY = "bHAAmfpA8mFf0K26b9mxw";
	public static final String CONSUMER_SECRET= "S48mM0SSqvB93ol29BLPIwrGFOYT5cS9H2GFwP63nq0";
	
	public static final String REQUEST_URL = "http://api.twitter.com/oauth/request_token";
	public static final String ACCESS_URL = "http://api.twitter.com/oauth/access_token";
	public static final String AUTHORIZE_URL = "http://api.twitter.com/oauth/authorize";
 
	public static final String OAUTH_CALLBACK_SCHEME = "parkalert-oauth-twitter";
	public static final String OAUTH_CALLBACK_HOST = "callback";
	public static final String OAUTH_CALLBACK_URL	= OAUTH_CALLBACK_SCHEME + "://" + OAUTH_CALLBACK_HOST;
	
	public static final String PREFS_OAUTH_TOKEN = "twitter_" + OAuth.OAUTH_TOKEN;
	public static final String PREFS_OAUTH_TOKEN_SECRET = "twitter_" + OAuth.OAUTH_TOKEN_SECRET;
	
	public static boolean isAuthenticated(SharedPreferences prefs) {

		String token = prefs.getString(OAuth.OAUTH_TOKEN, "");
		String secret = prefs.getString(OAuth.OAUTH_TOKEN_SECRET, "");
		
		if(token.length() == 0 || secret.length() == 0){
			return false;
		}
		
		AccessToken accessToken = new AccessToken(token,secret);
		Twitter twitter = new TwitterFactory().getInstance();
		twitter.setOAuthConsumer(TwitterUtils.CONSUMER_KEY, TwitterUtils.CONSUMER_SECRET);
		twitter.setOAuthAccessToken(accessToken);
		
		try {
			twitter.getAccountSettings();
			return true;
		} catch (TwitterException e) {
			return false;
		}
	}
	
	public static void loginWithTwitter(Activity activity, SharedPreferences prefs){
		
		String token = prefs.getString(OAuth.OAUTH_TOKEN, "");
		String secret = prefs.getString(OAuth.OAUTH_TOKEN_SECRET, "");
		
		AccessToken accessToken = new AccessToken(token,secret);
		Twitter twitter = new TwitterFactory().getInstance();
		twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);
		twitter.setOAuthAccessToken(accessToken);
		twitter.getAuthorization();
		
		String screenName = null;
		String name = null;
		
		try {
			User user = twitter.showUser(accessToken.getUserId());
			screenName = user.getScreenName();
			name = user.getName();
			
			String result = REST.loginTwitter(activity.getApplicationContext(), screenName, name);

			if (REST.checkForStopConditions(activity.getApplicationContext(), result)) {
				return;
			}

			SharedPreferences.Editor editor = prefs.edit();
			editor.putString("regular_access_token", result);
			editor.commit();

			MainMapActivity.redirectToLogin(activity);
		} catch (TwitterException e) {
			Log.e("[TwitterConnect]", "Error connecting: ", e);
			Toast.makeText(activity.getApplicationContext(), "Não foi possível ligá-lo via Twitter", Toast.LENGTH_LONG).show();
		} catch (Exception ex){
			Log.e("[TwitterConnect]", "Error connecting: ", ex);
			Toast.makeText(activity.getApplicationContext(), "Não foi possível ligá-lo via Twitter", Toast.LENGTH_LONG).show();
		}
	}
	
}
