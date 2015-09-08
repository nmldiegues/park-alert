package misc;

public class Pair<E1,E2> {
	
	E1 first;
	E2 second;
	
	public Pair(E1 first, E2 second) {
		super();
		this.first = first;
		this.second = second;
	}

	public E1 getFirst() {
		return first;
	}

	public void setFirst(E1 first) {
		this.first = first;
	}

	public E2 getSecond() {
		return second;
	}

	public void setSecond(E2 second) {
		this.second = second;
	}

}
