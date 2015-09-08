package com.emel.alert;

import java.util.ArrayList;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.widget.Toast;

import com.google.android.maps.ItemizedOverlay;
import com.google.android.maps.OverlayItem;

public class LocationOverlay extends ItemizedOverlay<OverlayItem> {
	
	private ArrayList<OverlayItem> mOverlays = new ArrayList<OverlayItem>();
	private Context mContextParent;
	
	public LocationOverlay(Drawable defaultMarker, Context context) {
		super(boundCenterBottom(defaultMarker));
		mContextParent = context;
	}

	@Override
	protected OverlayItem createItem(int i) {
		return mOverlays.get(i);
	}

	@Override
	public int size() {
		return mOverlays.size();
	}
	
	public void addOverlay(OverlayItem overlay) {
		mOverlays.add(overlay);
		populate();
	}
	
	@Override
	protected boolean onTap(int i) {
		Toast.makeText(mContextParent, mOverlays.get(i).getTitle(), Toast.LENGTH_LONG).show();
		return true;
	}

}
