package pt.codebits.park.alert.help;

import pt.codebits.park.alert.R;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

public class ReportHelp extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.helpmap);
		
		ImageButton parkBtn = (ImageButton) findViewById(R.id.locatebtn);
		parkBtn.setFocusable(true);
		parkBtn.setFocusableInTouchMode(true);
		parkBtn.requestFocus();
		
		TextView text = (TextView)findViewById(R.id.helpmsg);
		text.setText("O botão em foco permite reportar fiscalizações de forma idêntica ao estacionamento.");

		text = (TextView)findViewById(R.id.msgtop);
		text.setText("Ajuda - Reportar");
		
		Button button = (Button)findViewById(R.id.next);
		button.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
				Intent intent = new Intent(ReportHelp.this, PointsHelp.class);
				intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
				ReportHelp.this.startActivity(intent);
				ReportHelp.this.finish();
			}
		});
	}
	
}
