package pt.codebits.park.alert;

import pt.codebits.park.alert.comm.Authentication;
import pt.codebits.park.alert.comm.REST;

import com.google.gson.Gson;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageButton;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

public class LeaderboardActivity extends Activity{
	
	public class Rank {
		private String username;
		private Long rank;
		private Long score;
		private boolean requester;
		
		public String getUsername() {
			return username;
		}
		public void setUsername(String username) {
			this.username = username;
		}
		public Long getRank() {
			return rank;
		}
		public void setRank(Long rank) {
			this.rank = rank;
		}
		public Long getScore() {
			return score;
		}
		public void setScore(Long score) {
			this.score = score;
		}
		public boolean isRequester() {
			return requester;
		}
		public void setRequester(boolean requester) {
			this.requester = requester;
		}
		
		
	}
	
	private static final int RANK_AMOUNT = 10; 
	private ImageButton parkBtn;
	private ImageButton locateBtn;
	private ImageButton mapBtn;
	private TextView yourScore;
	private TableLayout scoreHeading;
	private TableLayout scores;
	private String token;
	private boolean isParked;
	
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.leaderboard);
		token = getIntent().getStringExtra("token");
		isParked = getIntent().getBooleanExtra("isparked", false);
		
		parkBtn = (ImageButton) findViewById(R.id.parkbtn);
		locateBtn = (ImageButton) findViewById(R.id.locatebtn);
		mapBtn = (ImageButton) findViewById(R.id.mapbtn);
		yourScore = (TextView) findViewById(R.id.yourscore);
		scores = (TableLayout) findViewById(R.id.tableLayout1);
		scoreHeading = (TableLayout) findViewById(R.id.scores_heading);
		
		if(isParked){
			parkBtn.setBackgroundResource(R.drawable.removerbtnstate);
			parkBtn.clearFocus();
			parkBtn.setSelected(false);
		}
		
		parkBtn.setOnTouchListener(new OnTouchListener() {

			public boolean onTouch(View v, MotionEvent event) {
				Intent intent = new Intent(LeaderboardActivity.this, MainMapActivity.class);
				intent.putExtra("parkBtn", true);
				intent.putExtra("isparked", isParked);
				intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				startActivity(intent);
				overridePendingTransition(0, 0);
				finish();
				return false;
			}
		});

		locateBtn.setOnTouchListener(new OnTouchListener() {

			public boolean onTouch(View v, MotionEvent event) {
				Intent intent = new Intent(LeaderboardActivity.this, MainMapActivity.class);
				intent.putExtra("locateBtn", true);
				intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				startActivity(intent);
				overridePendingTransition(0, 0);
				finish();
				return false;
			}
		});

		mapBtn.setOnTouchListener(new OnTouchListener() {

			public boolean onTouch(View v, MotionEvent event) {
				Intent intent = new Intent(LeaderboardActivity.this, MainMapActivity.class);
				intent.putExtra("mapBtn", true);
				intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
				startActivity(intent);
				overridePendingTransition(0, 0);
				finish();
				return false;
			}
		});
		
		
		fillTableScores();
		
	}

	
	private Rank[] convertRanks(String result) {
		Gson gson = new Gson();
		return gson.fromJson(result, Rank[].class);
	}
	
	private void fillTableScores(){
		new Thread() {
			public void run() {
				final String result = REST.rankingRequest(LeaderboardActivity.this, Authentication.getTokenId(token), Authentication.getTokenValue(token), RANK_AMOUNT);
				LeaderboardActivity.this. runOnUiThread(new Runnable() {
					public void run() {
						TableRow row;
						TextView numberCol, userCol, scoreCol, headerLeft, headerMiddle, headerRight;
						boolean rowColorSwitch = true;
						Rank[] ranks;
						Rank user = null;
						
						if(result == null || result.length() == 0){
							return;
						}
						ranks = convertRanks(result);
						
						for(Rank rank : ranks){
							if(rank.isRequester()){
								yourScore.setText(rank.getScore().toString());
								user = rank;
							}
						}
						
						//Converting to dip unit
						int dip = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP,
								(float) 1, getResources().getDisplayMetrics());
						
						headerLeft = new TextView(LeaderboardActivity.this);
						headerLeft.setTextColor(getResources().getColor(R.color.white));
						headerMiddle = new TextView(LeaderboardActivity.this);
						headerMiddle.setTextColor(getResources().getColor(R.color.white));
						headerRight = new TextView(LeaderboardActivity.this);
						headerRight.setTextColor(getResources().getColor(R.color.white));
						
						headerLeft.setText("#");
						headerMiddle.setText(R.string.user);
						headerRight.setText(R.string.points);
						
						headerLeft.setTypeface(null, 1);
						headerMiddle.setTypeface(null, 1);
						headerRight.setTypeface(null, 1);
						
						headerLeft.setTextSize(18);
						headerMiddle.setTextSize(18);
						headerRight.setTextSize(18);
						
						headerLeft.setWidth(4 * dip);
						headerMiddle.setWidth(180 * dip);
						headerRight.setWidth(250 * dip);
						headerLeft.setPadding(10*dip, 0, 0, 0);
						headerMiddle.setPadding(55*dip, 0, 0, 0);
						headerRight.setPadding(50*dip, 0, 0, 0);
						
						TableRow rowS = new TableRow(LeaderboardActivity.this);
						rowS.addView(headerLeft);
						rowS.addView(headerMiddle);
						rowS.addView(headerRight);
						scoreHeading.addView(rowS, new TableLayout.LayoutParams(
								LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
						
						for (Rank rank : ranks) {
							row = new TableRow(LeaderboardActivity.this); 
							
							if(rank.equals(user)){
								row.setBackgroundResource(R.color.blue_light);
							}
							else if(rank.getRank() == user.rank - 1 || rank.getRank() == user.rank + 1){
								row.setBackgroundResource(R.color.blue_green_grey);
							}
							else if(rowColorSwitch){
								row.setBackgroundResource(R.color.yellow2);
								rowColorSwitch = false;
							}
							else{
								row.setBackgroundResource(R.color.yellow1);
								rowColorSwitch = true;
							}
							
							numberCol = new TextView(LeaderboardActivity.this);
							numberCol.setTextColor(getResources().getColor(R.color.black));
							userCol = new TextView(LeaderboardActivity.this);
							userCol.setTextColor(getResources().getColor(R.color.black));
							scoreCol = new TextView(LeaderboardActivity.this);
							scoreCol.setTextColor(getResources().getColor(R.color.black));
							
							numberCol.setText(String.valueOf(rank.getRank()));
							userCol.setText(rank.getUsername());
							scoreCol.setText(rank.getScore().toString());
							
							numberCol.setTypeface(null, 1);
							userCol.setTypeface(null, 1);
							scoreCol.setTypeface(null, 1);
							
							numberCol.setTextSize(18);
							userCol.setTextSize(18);
							scoreCol.setTextSize(18);
							
							numberCol.setWidth(35 * dip);
							userCol.setWidth(180 * dip);
							scoreCol.setWidth(250 * dip);
							numberCol.setPadding(10*dip, 0, 0, 0);
							userCol.setPadding(40*dip, 0, 0, 0);
							scoreCol.setPadding(50*dip, 0, 0, 0);
							row.addView(numberCol);
							row.addView(userCol);
							row.addView(scoreCol);
							
							scores.addView(row, new TableLayout.LayoutParams(
									LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
							
						}
						
					}
				});
			}
		}.start();
		
	}

}
