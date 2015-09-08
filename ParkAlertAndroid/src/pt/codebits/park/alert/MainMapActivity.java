package pt.codebits.park.alert;

import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import pt.codebits.park.alert.breceiver.C2DMMessageReceiver;
import pt.codebits.park.alert.breceiver.RegistDevice;
import pt.codebits.park.alert.comm.Authentication;
import pt.codebits.park.alert.comm.Park;
import pt.codebits.park.alert.comm.REST;
import pt.codebits.park.alert.comm.Report;
import pt.codebits.park.alert.help.BeginHelp;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.View.OnTouchListener;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.OverlayItem;
import com.google.android.maps.Projection;
import com.google.gson.Gson;

public class MainMapActivity extends MapActivity {

	private SharedPreferences mPrefs;
	public static final String PREFS_NAME = "ValuesPreferences";
	public static final String REGIST_DEVICE_FILTER = "pt.codebits.park.alert.REGISTDEVICE";
	private String token;
	private RegistDevice registReceiver;

	protected class ParkState {
		private boolean parked;
		private Location currentGPS;

		protected ParkState(boolean parked, Location location) { 
			this.parked = parked;
			this.currentGPS = location;
		}

		protected Location getLocation() {
			return this.currentGPS;
		}

		protected void setLocation(Location location) {
			this.currentGPS = location;
		}

		protected boolean isParked() { 
			return this.parked; 
		}

		protected void park() { 
			this.parked = true;
		}

		protected void removeCar() { 
			this.parked = false;
		}
	}

	private MapView mMap;
	private ParkState mParkState;
	private LocationManager mManager;
	private LocationListener mLocationListener;
	private List<Overlay> mMapOverlays;
	private IconOverlay mCarOverlay;
	private IconOverlay mAgentOverlay;
	private volatile Location agentSpottingLocation;
	private Overlay mTempOverlay;

	// buttons ontouch listeners
	private OnTouchListener parkListener;
	private OnTouchListener spotListener;
	private OnTouchListener pointsListener;

	private Map<String, IconOverlay> agentsIndex = Collections.synchronizedMap(new HashMap<String, IconOverlay>());

	/*
	 * The code of this activity is split in different phases of the activity lifecycle.
	 *
	 * onCreate only executes when this activity is launched after the application was killed 
	 * or started for the first time. Thus, onCreate shall have code that never has to be  
	 * repeated until the applicaton is killed:
	 *   - Initialize location manager, preferences manager
	 *   - Set the content's view
	 *   - Initialize the park state maintained locally
	 *   - Initialize the map, lower buttons and their actions
	 * 
	 * onResume always executes when the activity is put in the forefront:
	 *   - Center the map in the GPS location (locationListener variable)
	 *   - Update the map contents with a possible parked car and reports of agents
	 * 
	 * Look into android dev's site for more details: 
	 * 		http://developer.android.com/reference/android/app/Activity.html#ProcessLifecycle
	 */

	@Override
	public void onCreate(Bundle savedInstanceState) {

		super.onCreate(savedInstanceState);
		setContentView(R.layout.mainmap);

		mPrefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
		token = mPrefs.getString("regular_access_token", "null");

		mManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

		// Define a listener that responds to location updates
		mLocationListener = new LocationListener() {
			public void onLocationChanged(Location location) {
				// Called when a new location is found by the network location provider.
				if (mCarOverlay == null) {
					mMap.getController().setCenter(new GeoPoint((int) (location.getLatitude() * 1E6), (int) (location.getLongitude() * 1E6)));
					mParkState.setLocation(location);
				}

				// Cancel further updates, only needed one!
				mManager.removeUpdates(this);
			}

			public void onStatusChanged(String provider, int status, Bundle extras) {}

			public void onProviderEnabled(String provider) {}

			public void onProviderDisabled(String provider) {}
		};

		mParkState = new ParkState(getIntent().getBooleanExtra("isparked", false), new Location(LocationManager.GPS_PROVIDER));


		mMap = (MapView)findViewById(R.id.mapview);
		MapView map = mMap;
		// map.setBuiltInZoomControls(true);
		map.getController().setZoom(19);
		map.setSatellite(true);
		// temporary location until a fix is obtained in the GPS
		map.getController().setCenter(new GeoPoint((int) (38.720244 * 1E6), (int) (-9.145593 * 1E6)));
		mMapOverlays = map.getOverlays();

		final ImageButton parkBtn = (ImageButton) findViewById(R.id.parkbtn);
		final ImageButton locateBtn = (ImageButton) findViewById(R.id.locatebtn);
		final ImageButton mapBtn = (ImageButton) findViewById(R.id.mapbtn);
		final ImageButton pontBtn = (ImageButton) findViewById(R.id.pontbtn);

		// Make the buttons focusable
		parkBtn.setFocusableInTouchMode(true);
		locateBtn.setFocusableInTouchMode(true);
		mapBtn.setFocusableInTouchMode(true);
		pontBtn.setFocusableInTouchMode(true);

		// Make the map button focused by default (to be highlighted)
		mapBtn.requestFocus();

		pointsListener = new OnTouchListener() {

			public boolean onTouch(View v, MotionEvent event) {

				Intent intent = new Intent(MainMapActivity.this, LeaderboardActivity.class);
				intent.putExtra("token", token);
				intent.putExtra("isparked", mParkState.isParked());
				startActivity(intent);
				overridePendingTransition(0, 0);
				finish();
				return false;
			}
		};
		pontBtn.setOnTouchListener(pointsListener);

		// Handle parking agent localization
		spotListener = new OnTouchListener() {

			public boolean onTouch(View v, MotionEvent event) {
				listenToAgentSpottingRequest();
				mMap.setOnTouchListener(new OnTouchListener() {
					boolean userIsPanning = false;

					public boolean onTouch(View v, MotionEvent event) {
						//parkBtn.requestFocus();
						int actionId = event.getAction();
						if (actionId == MotionEvent.ACTION_UP && userIsPanning) {
							userIsPanning = false;

							int x = (int)event.getX();
							int y = (int)event.getY();
							placeAgentMarker(mMap.getMapCenter(), false);
							// Update the park state with the new marker location
							agentSpottingLocation = tapActionToLocation(x, y);

							return false;
						} else if (actionId == MotionEvent.ACTION_MOVE) {
							userIsPanning = true;
						}
						return false;
					}
				});
				return false;
			}


			private boolean listenToAgentSpottingRequest() {
				// Change top bar message
				final TextView topMsgView = (TextView) findViewById(R.id.msgtop);
				topMsgView.setText(R.string.agentlocateaction);

				// Fetch GPS location and add marker (of the agent) in the map
				final LocationListener locationListener = new LocationListener() {
					public void onLocationChanged(Location location) {
						// Called when a new location is found by the network location provider.
						mMap.getController().setCenter(new GeoPoint((int) (location.getLatitude() * 1E6), (int) (location.getLongitude() * 1E6)));
						agentSpottingLocation = location;
						placeAgentMarker(agentSpottingLocation);		
						// Cancel further updates, only needed one!
						mManager.removeUpdates(this);
					}

					public void onStatusChanged(String provider, int status, Bundle extras) {}

					public void onProviderEnabled(String provider) {}

					public void onProviderDisabled(String provider) {}
				};

				// Register the listener with the Location Manager to receive location updates
				mManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, locationListener);

				final RelativeLayout confirmBox = (RelativeLayout) findViewById(R.id.confirmbox);
				final ImageButton confirmBtn = (ImageButton) findViewById(R.id.confirmbtn);
				final ImageButton cancelBtn = (ImageButton) findViewById(R.id.cancelbtn);

				// Add listener to the cancel (red cross) button 
				cancelBtn.setOnClickListener(new OnClickListener() {
					public void onClick(View v) {
						// Stop allowing move the car marker
						mMap.setOnTouchListener(null);

						// Revert the top bar message
						topMsgView.setText(R.string.maplocations);

						// Remove the agent marker from the map
						removeMarker(mAgentOverlay);

						// Hide the confirmation box
						confirmBox.setVisibility(View.INVISIBLE);
						confirmBtn.setOnClickListener(null);
						cancelBtn.setOnClickListener(null);

						mapBtn.requestFocus();
					}
				});

				// Add listener to the confirm (green ok) button
				confirmBtn.setOnClickListener(new OnClickListener() {
					public void onClick(View v) {
						// Stop allowing move the car marker
						mMap.setOnTouchListener(null);

						// The actions corresponding to a park confirmation entail a remote request.
						// Once it is answered, we run the UI changes on the UI thread
						new Thread() {
							@Override
							public void run() {
								final Location currentLocation = agentSpottingLocation;
								// Send request to the backend to park the car
								String result = REST.agentSpottingRequest(MainMapActivity.this, Authentication.getTokenId(token), 
										Authentication.getTokenValue(token), currentLocation.getLatitude(), currentLocation.getLongitude());

								if (REST.checkForStopConditions(MainMapActivity.this, result)) {
									return;
								}

								// to prevent the next display of an agent from deleting this one
								mAgentOverlay = null;

								Log.d("SpottingRequest-Result", result);

								// UI changes after the REST request was answered (positively, need to check on possible errors)
								MainMapActivity.this.runOnUiThread(new Runnable(){
									public void run() {
										// Revert the top bar message
										topMsgView.setText(R.string.maplocations);

										// Hide the confirmation box
										confirmBox.setVisibility(View.INVISIBLE);
										confirmBtn.setOnClickListener(null);
										cancelBtn.setOnClickListener(null);

										// Provide some feedback to the user
										Toast.makeText(MainMapActivity.this, R.string.spotsuccess, Toast.LENGTH_LONG).show();

										mapBtn.requestFocus();
									}
								});
							}
						}.start();
					}
				});

				// Add confirmation box
				confirmBox.setVisibility(View.VISIBLE);

				return true;
			}
		};
		locateBtn.setOnTouchListener(spotListener);

		// Handle park and removal of car
		parkListener = new OnTouchListener() {
			public boolean onTouch(View v, MotionEvent event) {
				// Ensure consistent state
				if(mParkState.isParked()) {
					listenToRemoveRequest();
				} else {
					listenToParkRequest();

					// Allow moving the car marker
					mMap.setOnTouchListener(new OnTouchListener() {
						boolean userIsPanning = false;

						public boolean onTouch(View v, MotionEvent event) {
							int actionId = event.getAction();
							if (actionId == MotionEvent.ACTION_UP && userIsPanning) {
								userIsPanning = false;

								int x = (int)event.getX();
								int y = (int)event.getY();
								placeCarMarker(mMap.getMapCenter(), false);
								// Update the park state with the new marker location
								mParkState.setLocation(tapActionToLocation(x, y));
								final double lat = mParkState.currentGPS.getLatitude();
								final double lon = mParkState.currentGPS.getLongitude();

								// Fetch any recent reports in this area
								fetchCloseRecentReports(lat, lon);

								return false;
							} else if (actionId == MotionEvent.ACTION_MOVE) {
								userIsPanning = true;
							}
							return false;
						}

					});
				}

				return false;
			}

			private void fetchCloseRecentReports(final double lat, final double lon) {
				new Thread() {
					public void run() {
						final String result = REST.closeReports(MainMapActivity.this, Authentication.getTokenId(token), 
								Authentication.getTokenValue(token), lat, lon);
						if (REST.checkForStopConditions(MainMapActivity.this, result)) {
							return;
						}
						MainMapActivity.this.runOnUiThread(new Runnable() {
							public void run() {
								drawReports(convertReports(result), false);
							}
						});
					}
				}.start();
			}

			private boolean listenToParkRequest() {
				// Change top bar message
				final TextView topMsgView = (TextView) findViewById(R.id.msgtop);
				topMsgView.setText(R.string.parkaction);

				// Fetch GPS location and add marker (of the car) in the map
				final LocationListener locationListener = new LocationListener() {
					public void onLocationChanged(Location location) {
						// Called when a new location is found by the network location provider.
						mMap.getController().setCenter(new GeoPoint((int) (location.getLatitude() * 1E6), (int) (location.getLongitude() * 1E6)));
						mParkState.setLocation(location);
						placeCarMarker(mParkState.getLocation());		
						// Cancel further updates, only needed one!
						mManager.removeUpdates(this);
						// Populate nearby agents
						fetchCloseRecentReports(location.getLatitude(), location.getLongitude());
					}

					public void onStatusChanged(String provider, int status, Bundle extras) {}

					public void onProviderEnabled(String provider) {}

					public void onProviderDisabled(String provider) {}
				};

				// Register the listener with the Location Manager to receive location updates
				mManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, locationListener);

				final RelativeLayout confirmBox = (RelativeLayout) findViewById(R.id.confirmbox);
				final ImageButton confirmBtn = (ImageButton) findViewById(R.id.confirmbtn);
				final ImageButton cancelBtn = (ImageButton) findViewById(R.id.cancelbtn);

				// Add listener to the cancel (red cross) button 
				cancelBtn.setOnClickListener(new OnClickListener() {
					public void onClick(View v) {
						// Stop allowing move the car marker
						mMap.setOnTouchListener(null);

						// Revert the top bar message
						topMsgView.setText(R.string.maplocations);

						// Remove the car marker from the map
						removeMarker(mCarOverlay);

						// Hide the confirmation box
						confirmBox.setVisibility(View.INVISIBLE);
						confirmBtn.setOnClickListener(null);
						cancelBtn.setOnClickListener(null);

						mapBtn.requestFocus();
					}
				});

				// Add listener to the confirm (green ok) button
				confirmBtn.setOnClickListener(new OnClickListener() {
					public void onClick(View v) {
						// Stop allowing move the car marker
						mMap.setOnTouchListener(null);

						// The actions corresponding to a park confirmation entail a remote request.
						// Once it is answered, we run the UI changes on the UI thread
						new Thread() {
							@Override
							public void run() {
								final Location currentLocation = mParkState.getLocation();
								// Send request to the backend to park the car

								Log.d("Location-Test", "Parked at: "+currentLocation.getLatitude() + " : " + currentLocation.getLongitude());

								String result = REST.parkRequest(MainMapActivity.this, Authentication.getTokenId(token), 
										Authentication.getTokenValue(token), currentLocation.getLatitude(), currentLocation.getLongitude());
								if (REST.checkForStopConditions(MainMapActivity.this, result)) {
									return;
								}

								Log.d("ParkRequest-Result", result);

								// UI changes after the REST request was answered (positively, need to check on possible errors)
								MainMapActivity.this.runOnUiThread(new Runnable(){
									public void run() {
										// Revert the top bar message
										topMsgView.setText(R.string.maplocations);

										// Hide the confirmation box
										confirmBox.setVisibility(View.INVISIBLE);
										confirmBtn.setOnClickListener(null);
										cancelBtn.setOnClickListener(null);

										// Provide some feedback to the user
										Toast.makeText(MainMapActivity.this, R.string.parksuccess, Toast.LENGTH_LONG).show();

										// Change the park button icon to "unpark"
										parkBtn.setBackgroundResource(R.drawable.removerbtnstate);
										parkBtn.clearFocus();
										parkBtn.setSelected(false);

										mapBtn.requestFocus();

										mParkState.park();
									}
								});

							}
						}.start();
					}
				});

				// Add confirmation box
				confirmBox.setVisibility(View.VISIBLE);

				return true;
			}

			private boolean listenToRemoveRequest() {
				// Simpler version of parking in inverse order, execute blocking code in a concurrent thread
				new Thread() {
					public void run() {
						// Blocking REST request to unpark
						String result = REST.unparkRequest(MainMapActivity.this, Authentication.getTokenId(token), 
								Authentication.getTokenValue(token));
						if (REST.checkForStopConditions(MainMapActivity.this, result)) {
							return;
						}

						// Set local state accordingly
						mParkState.removeCar();

						// Change the UI accordingly, back to the 'pristine' state 
						MainMapActivity.this.runOnUiThread(new Runnable() {
							public void run() {
								// Remove the car marker
								removeMarker(mCarOverlay);

								// Change the park button back to the park icon
								parkBtn.setBackgroundResource(R.drawable.estacionarbtnstate);
								parkBtn.clearFocus();
								parkBtn.setSelected(false);
								mapBtn.requestFocus();

								// Feedback to the user
								Toast.makeText(MainMapActivity.this, R.string.unparksucess, Toast.LENGTH_LONG).show();
							}
						});
					}
				}.start();

				return true;
			}
		};
		parkBtn.setOnTouchListener(parkListener);

		if(getIntent().getBooleanExtra("parkBtn", false)){
			parkListener.onTouch(getCurrentFocus(), MotionEvent.obtain(SystemClock.uptimeMillis(), SystemClock.uptimeMillis(), MotionEvent.ACTION_UP, 0, 0, 0));
			parkBtn.requestFocus();
		}
		else if(getIntent().getBooleanExtra("locateBtn", false)){
			spotListener.onTouch(getCurrentFocus(), MotionEvent.obtain(SystemClock.uptimeMillis(), SystemClock.uptimeMillis(), MotionEvent.ACTION_UP, 0, 0, 0));
			locateBtn.requestFocus();
		}
		else if(!getIntent().getBooleanExtra("mapBtn", false)){
			registNotifications();
			registReceiver = new RegistDevice(token);
			registerReceiver(registReceiver, new IntentFilter(REGIST_DEVICE_FILTER));
		}

	}

	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case R.id.logout:
			logout();
			return true;
		case R.id.ajuda:
			Intent intent = new Intent(MainMapActivity.this, BeginHelp.class);
			intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
			MainMapActivity.this.startActivity(intent);
			MainMapActivity.this.finish();
			return true;
		case R.id.map:
			swapMapView();
			return true;
		default:
			return super.onOptionsItemSelected(item);
		}
	}

	private void swapMapView() {
		MainMapActivity.this.runOnUiThread(new Runnable() {
			public void run() {
				mMap.setSatellite(!mMap.isSatellite());
				mMap.postInvalidateDelayed(2000);
			}
		});
	}

	private void logout() {
		SharedPreferences.Editor editor = mPrefs.edit();
		editor.clear();
		editor.commit();
		LoginActivity.redirectToLogin(MainMapActivity.this);
	}

	public boolean onCreateOptionsMenu(Menu menu) {
		MenuInflater inflater = getMenuInflater();
		inflater.inflate(R.menu.optionsmenu, menu);
		return true;
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		if (registReceiver != null) {
			unregisterReceiver(registReceiver);
			registReceiver = null;
		}
	}

	@Override
	protected void onPause() {
		super.onPause();
		if (registReceiver != null) {
			unregisterReceiver(registReceiver);
			registReceiver = null;
		}
	}

	@Override
	protected void onResume() {
		super.onResume();



		// Register the listener with the Location Manager to center the map
		mManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, mLocationListener);

		// Request recent reports from the backend
		new Thread() {
			public void run() {

				// check if the user has a parked car
				final String parkResult = REST.fetchParkState(MainMapActivity.this, Authentication.getTokenId(token), Authentication.getTokenValue(token));
				if (REST.checkForStopConditions(MainMapActivity.this, parkResult)) {
					return;
				}

				Log.d("Location-Test", "Received park state: "+parkResult);

				// Draw the location of the parked car
				MainMapActivity.this.runOnUiThread(new Runnable(){
					public void run() {
						drawCar(convertParks(parkResult));
					}
				});

				final String result = REST.fetchReports(MainMapActivity.this, Authentication.getTokenId(token), Authentication.getTokenValue(token));
				if (REST.checkForStopConditions(MainMapActivity.this, result)) {
					return;
				}

				// Draw the recent reports with the respective fading
				MainMapActivity.this.runOnUiThread(new Runnable(){
					public void run() {
						drawReports(convertReports(result));
					}
				});


				if (C2DMMessageReceiver.notif != null) {
					final String notifId = C2DMMessageReceiver.notif.nid;
					final double lat_f = Double.parseDouble(C2DMMessageReceiver.notif.latitude);
					final double longi_f = Double.parseDouble(C2DMMessageReceiver.notif.longitude);
					MainMapActivity.this.runOnUiThread(new Runnable() {
						public void run() {
							final int lat = (int) (lat_f * 1E6);
							final int longi = (int) (longi_f * 1E6);

							placeAgentMarkerUnconfirmed(new GeoPoint(lat, longi), true);
							mAgentOverlay = null;

							// center map on the notification; ask for confirmation as in the parking notification
							mMap.getController().setCenter(new GeoPoint(lat, longi));

							final RelativeLayout confirmBox = (RelativeLayout) findViewById(R.id.confirmbox);
							final TextView textv = (TextView) confirmBox.getChildAt(0); // hack-ish. we've got a static layout for now
							textv.setText("Confirmar Denúncia?");

							final ImageButton confirmBtn = (ImageButton) findViewById(R.id.confirmbtn);
							final ImageButton cancelBtn = (ImageButton) findViewById(R.id.cancelbtn);

							// Add listener to the cancel (red cross) button 
							cancelBtn.setOnClickListener(new OnClickListener() {
								public void onClick(View v) {
									C2DMMessageReceiver.notif = null;

									// Stop allowing move the car marker
									mMap.setOnTouchListener(null);

									new Thread() {
										public void run() {
											REST.denyNotification(MainMapActivity.this, notifId);
										}
									}.start();

									// UI changes after the REST request was answered (positively, need to check on possible errors)
									MainMapActivity.this.runOnUiThread(new Runnable(){
										public void run() {

											// Hide the confirmation box
											confirmBox.setVisibility(View.INVISIBLE);
											confirmBtn.setOnClickListener(null);
											cancelBtn.setOnClickListener(null);

											removeMarker(mTempOverlay);
											placeAgentMarker(new GeoPoint(lat, longi), true);
											mAgentOverlay = null;

											// Provide some feedback to the user
											Toast.makeText(MainMapActivity.this, R.string.notifsucess, Toast.LENGTH_LONG).show();

											((ImageButton) findViewById(R.id.mapbtn)).requestFocus();
										}
									});

								}
							});

							// Add listener to the confirm (green ok) button
							confirmBtn.setOnClickListener(new OnClickListener() {
								public void onClick(View v) {
									C2DMMessageReceiver.notif = null;

									// Stop allowing move the car marker
									mMap.setOnTouchListener(null);

									new Thread() {
										public void run() {
											REST.confirmNotification(MainMapActivity.this, notifId);
										}
									}.start();

									// UI changes after the REST request was answered (positively, need to check on possible errors)
									MainMapActivity.this.runOnUiThread(new Runnable(){
										public void run() {

											// Hide the confirmation box
											confirmBox.setVisibility(View.INVISIBLE);
											confirmBtn.setOnClickListener(null);
											cancelBtn.setOnClickListener(null);

											removeMarker(mTempOverlay);
											placeAgentMarker(new GeoPoint(lat, longi), true);
											mAgentOverlay = null;

											// Provide some feedback to the user
											Toast.makeText(MainMapActivity.this, R.string.notifsucess, Toast.LENGTH_LONG).show();

											((ImageButton) findViewById(R.id.mapbtn)).requestFocus();

										}
									});


								}
							});

							// Add confirmation box
							confirmBox.setVisibility(View.VISIBLE);

						}
					});

				}


			};
		}.start();




	}

	@Override
	public void onNewIntent(Intent arg0) {
		setIntent(arg0);
	}

	private Report[] convertReports(String report) {
		Gson gson = new Gson();
		return gson.fromJson(report, Report[].class);
	}

	private Park[] convertParks(String parkResult) {
		Gson gson = new Gson();
		return gson.fromJson(parkResult, Park[].class);
	}

	private void drawReports(Report[] reports, boolean center) {
		if (!center) {
			drawReports(reports);
		} else {
			for (Report report : reports) {
				placeAgentMarker(report.longitude, report.latitude, center, report.fade, report.date);
				// to avoid the next display agent marker from deleting this one
				mAgentOverlay = null;
			}
		}
	}

	private void drawReports(Report[] reports) {
		for (Report report : reports) {
			placeAgentMarker(report.longitude, report.latitude, false, report.fade, report.date);
			// to avoid the next display agent marker from deleting this one
			mAgentOverlay = null;
		}
	}

	private void drawCar(Park[] parks) {
		for (Park park : parks) {
			placeCarMarker(new GeoPoint((int) (park.latitude * 1E6) , (int) (park.longitude * 1E6)), true);

			final ImageButton parkBtn = (ImageButton) findViewById(R.id.parkbtn);
			// Change the park button icon to "unpark"
			parkBtn.setBackgroundResource(R.drawable.removerbtnstate);
			parkBtn.clearFocus();
			parkBtn.setSelected(false);

			mParkState.park();

			// there should only be at most one
			break;
		}
	}

	private void registNotifications() {
		Intent registrationIntent = new Intent("com.google.android.c2dm.intent.REGISTER");
		registrationIntent.putExtra("app", PendingIntent.getBroadcast(this, 0, new Intent(), 0)); // boilerplate
		registrationIntent.putExtra("sender", "park.alert.codebits@gmail.com");
		startService(registrationIntent);
	}

	private Location tapActionToLocation(int x, int y) {
		Projection projection = mMap.getProjection();
		GeoPoint geoPoint = projection.fromPixels(x, y);
		Location loc = new Location(LocationManager.GPS_PROVIDER);
		loc.setLatitude(geoPoint.getLatitudeE6() / 1E6);
		loc.setLongitude(geoPoint.getLongitudeE6() / 1E6);
		return loc;
	}

	private void placeCarMarker(Location location) {
		placeCarMarker(new GeoPoint((int) (location.getLatitude() * 1E6) , (int) (location.getLongitude() * 1E6)), true);
	}

	private void placeAgentMarker(double longitude, double latitude, boolean center, float fade, long date) {
		System.err.println(latitude + ":" + longitude);
		placeAgentMarker(new GeoPoint((int) (latitude * 1E6) , (int) (longitude * 1E6)), center, fade, date, R.drawable.agent);
	}

	private void placeAgentMarker(Location location) {
		System.err.println(location.getLatitude() + ":" + location.getLongitude());
		placeAgentMarker(new GeoPoint((int) (location.getLatitude() * 1E6) , (int) (location.getLongitude() * 1E6)), true);
	}

	private void placeCarMarker(GeoPoint parkSpot, boolean setCenter) {

		if (mCarOverlay != null) {
			mMapOverlays.remove(mCarOverlay);
		}

		mCarOverlay = new IconOverlay(MainMapActivity.this.getResources().getDrawable(R.drawable.car), MainMapActivity.this);

		OverlayItem spottingItem = new OverlayItem(parkSpot, getString(R.string.carparked), "");
		mCarOverlay.addOverlay(spottingItem);
		mMapOverlays.add(mCarOverlay);

		if (setCenter) {
			mMap.getController().setCenter(parkSpot);
		}
		mMap.invalidate();
	}

	private void placeAgentMarker(GeoPoint agentSpot, boolean setCenter) {
		placeAgentMarker(agentSpot, setCenter, 100.0f, 0L, R.drawable.agent);
	}

	private void placeAgentMarkerUnconfirmed(GeoPoint agentSpot, boolean setCenter) {
		placeAgentMarker(agentSpot, setCenter, 100.0f, 0L, R.drawable.policianolocalgreen);
	}

	private void placeAgentMarker(GeoPoint agentSpot, boolean setCenter, float fade, long date, int drawableId) {

		IconOverlay prev = agentsIndex.get(agentSpot.getLatitudeE6() + ":" + agentSpot.getLongitudeE6());
		if (prev != null) {
			mMapOverlays.remove(prev);
		} else if (mAgentOverlay != null) {
			mMapOverlays.remove(mAgentOverlay);
		}

		Drawable agent = MainMapActivity.this.getResources().getDrawable(drawableId);
		agent.mutate();
		if (fade != 100.0f) {
			agent.setAlpha((int)(fade * 255));
		}


		mAgentOverlay = new IconOverlay(agent, MainMapActivity.this);
		agentsIndex.put(agentSpot.getLatitudeE6() + ":" + agentSpot.getLongitudeE6(), mAgentOverlay);

		if(drawableId == R.drawable.policianolocalgreen)
			mTempOverlay = mAgentOverlay;

		Date parsedDate = date == 0L ? null : new Date(date);
		Calendar c = null;
		if(parsedDate != null) {
			c = Calendar.getInstance(TimeZone.getTimeZone("Europe/Lisbon"));
			c.setTime(parsedDate);
		}
		OverlayItem spottingItem = new OverlayItem(agentSpot, c == null ? "" : 
			"Reportado às " + c.get(Calendar.HOUR_OF_DAY) + ":" + c.get(Calendar.MINUTE), "");
		mAgentOverlay.addOverlay(spottingItem);
		mMapOverlays.add(mAgentOverlay);

		if (setCenter) {
			mMap.getController().setCenter(agentSpot);
		}
		mMap.invalidate();
	}

	private void removeMarker(Overlay overlay) {
		if(!mMapOverlays.isEmpty()) { 
			mMapOverlays.remove(overlay); 
			mMap.invalidate();
		}
	}


	@Override
	protected boolean isRouteDisplayed() {
		return false;
	}

	public static void redirectToLogin(final Activity activity) {
		SharedPreferences prefs = activity.getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
		final boolean showHelp = prefs.getBoolean("showHelp", true);
		final Class<? extends Activity> activityToRedir = showHelp ? BeginHelp.class : MainMapActivity.class;
		
		activity.runOnUiThread(new Runnable(){
			public void run() {
				Intent intent = new Intent(activity, activityToRedir);
				activity.startActivity(intent);
				if (showHelp) {
					intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
					activity.finish();
				}
				// remove this activity from the stack
				activity.finish();
			}
		});
	}

}
