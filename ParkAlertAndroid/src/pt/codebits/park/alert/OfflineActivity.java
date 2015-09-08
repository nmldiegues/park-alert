package pt.codebits.park.alert;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class OfflineActivity extends Activity {
	
	public static void launchOfflineActivity(Context context) {
		final Activity activity = (Activity)context;
		activity.runOnUiThread(new Runnable(){
			public void run() {
				Intent intent = new Intent(activity, OfflineActivity.class);
				intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
				activity.startActivity(intent);
				activity.finish();
			}
		});
	}
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.offlineactivity);
		
		Button button = (Button) findViewById(R.id.buttonOffline);
		button.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				Intent intent = new Intent(OfflineActivity.this, ParkAlertActivity.class);
				intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				startActivity(intent);
				finish();
			}
		});
	}

}
