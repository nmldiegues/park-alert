package pt.codebits.park.alert.comm;

public class Authentication {

	public static long getTokenIdRevalidated(String token) {
		return getTokenId(token.substring(token.indexOf(':') + 1));
	}

	public static String getTokenValueRevalidated(String token) {
		return getTokenValue(token.substring(token.indexOf(':') + 1));
	}
	
	public static long getTokenId(String token) {
		return Long.parseLong(token.substring(0, token.indexOf(':')));
	}
	
	public static String getTokenValue(String token) {
		return token.substring(token.indexOf(':') + 1);
	}
	
}
