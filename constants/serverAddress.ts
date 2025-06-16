const getServerAddress = () => {
	// dev / prod 분기, .env 사용 등 자유롭게
	return "http://192.168.0.15:8080";
};
export default getServerAddress;
