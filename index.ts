import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://www.kalibrr.com/_next/data/U7EYscDFlyEdi6ic6P0Bg/id-ID/home/all-jobs.json',
  params: {
   param: "all-jobs",
  },
};

async function fetchData(): Promise<void> {
	try {
		const response = await axios.request(options);
		console.log(response.data.pageProps?.jobs);
	} catch (error) {
		console.error(error);
	}
}

fetchData();