package misc;

import java.util.Comparator;

import models.Rank;

//name, rank, score, requester?

public class RankComparator implements Comparator<Rank> {

	@Override
	public int compare(Rank o1, Rank o2) {
		if(o1.score > o2.score) {
			return -1;
		} else {
			if(o1.score < o2.score) {
				return 1;
			} else {
				return 0;
			}
		}
	}
}