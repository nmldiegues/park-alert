package pt.codebits.park.alert.help;

import pt.codebits.park.alert.R;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

public class BeginHelp extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.helpmap);
		
		TextView text = (TextView)findViewById(R.id.helpmsg);
		text.setText("Nesta zona aparecerá o mapa. Em baixo estão os botões de acção.");

		text = (TextView)findViewById(R.id.msgtop);
		text.setText("Ajuda - Mapa");
		
		Button button = (Button)findViewById(R.id.next);
		button.setOnClickListener(new OnClickListener() {
			public void onClick(View v) {
				Intent intent = new Intent(BeginHelp.this, ParkHelp.class);
				intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
				BeginHelp.this.startActivity(intent);
				BeginHelp.this.finish();
			}
		});
	}
	
}
