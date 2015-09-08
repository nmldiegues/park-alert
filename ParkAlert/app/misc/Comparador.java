package misc;

import java.util.Comparator;

//name, rank, score, requester?

public class Comparador implements Comparator<Pair<String,Pair<Long,Pair<Long,Boolean>>>> {

	@Override
	public int compare(Pair<String,Pair<Long,Pair<Long,Boolean>>> o1, Pair<String,Pair<Long,Pair<Long,Boolean>>> o2) {
		if(o1.getSecond().getSecond().getFirst()>o2.getSecond().getSecond().getFirst()) {
			return -1;
		} else {
			if(o1.getSecond().getSecond().getFirst()<o2.getSecond().getSecond().getFirst()) {
				return 1;
			} else {
				return 0;
			}
		}
	}
}
