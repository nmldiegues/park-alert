package pt.codebits.park.alert.help;

import pt.codebits.park.alert.MainMapActivity;
import pt.codebits.park.alert.R;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

public class PointsHelp extends Activity {

	private SharedPreferences mPrefs;
	public static final String PREFS_NAME = "ValuesPreferences";
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.helpmap);
		
		ImageButton parkBtn = (ImageButton) findViewById(R.id.pontbtn);
		parkBtn.setFocusable(true);
		parkBtn.setFocusableInTouchMode(true);
		parkBtn.requestFocus();
		
		TextView text = (TextView)findViewById(R.id.helpmsg);
		text.setText("Pode ver os pontos no botão em foco. Tem algumas opções disponíveis através do botão físico de opções no seu Android.");

		text = (TextView)findViewById(R.id.msgtop);
		text.setText("Ajuda - Pontos e Opções");
		
		Button button = (Button)findViewById(R.id.next);
		button.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
				Intent intent = new Intent(PointsHelp.this, MainMapActivity.class);
				intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				PointsHelp.this.startActivity(intent);
				PointsHelp.this.finish();
			}
		});
		
		mPrefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.putBoolean("showHelp", false);
		editor.commit();
	}
	
}
