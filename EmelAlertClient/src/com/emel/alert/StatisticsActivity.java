package com.emel.alert;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class StatisticsActivity extends Activity {
	@Override
    public void onCreate(Bundle savedInstanceState) {
		
		super.onCreate(savedInstanceState);
	    setContentView(R.layout.statistics);
		
		String stats = getIntent().getStringExtra("stats");
		
		Log.v("test",stats);
		
		TextView text = (TextView) findViewById(R.id.statsText);
		
		String str = "";
		
		for(String s : stats.split(":")) {
			if(s.length()>2) {
				Log.v("test2", "weee"+s+"eeew");
				String[] r = s.split(";");
				str += "User: " + r[0] + " Score: " + r[1] + "\n";
			}
		}
		
		text.setText(str);
		/*
		if(stats.contains("|")) {
			String txt = "";
			String[] scores = stats.split("|");
			if(scores!=null) {
				Log.v("test",scores[1]);
				int i;
				for(i = 0; i < scores.length; i++) {
					if(scores[i]!=null && scores[i].contains(";")) {
					Log.v("string","str:" + scores[i]);
					txt += "User: " + scores[i].split(";")[0] + ". Score: " + scores[i].split(";")[1] + "\n";
					}
				}
				text.setText(txt);
			}
		}*/
	}
}	
