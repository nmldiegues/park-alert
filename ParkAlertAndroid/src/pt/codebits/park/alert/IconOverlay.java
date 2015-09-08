package pt.codebits.park.alert;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.widget.Toast;

import com.google.android.maps.ItemizedOverlay;
import com.google.android.maps.OverlayItem;

public class IconOverlay extends ItemizedOverlay<OverlayItem> {

	private OverlayItem mCarOverlay;
	private Context mContextParent;

	public IconOverlay(Drawable defaultMarker, Context context) {
		super(boundCenterBottom(defaultMarker));
		this.mContextParent = context;
	}

	@Override
	protected OverlayItem createItem(int i) {
		return mCarOverlay;
	}

	@Override
	public int size() {
		return 1;
	}

	public void addOverlay(OverlayItem overlay) {
		mCarOverlay = overlay;
		populate();
	}

	@Override
	protected boolean onTap(int i) {
		Toast.makeText(mContextParent, mCarOverlay.getTitle(), Toast.LENGTH_LONG).show();
		return true;
	}

}
