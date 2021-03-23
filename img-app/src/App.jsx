import  {useCallback, useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';
import Dropzone from 'react-dropzone'
import Loader from "react-loader-spinner"

function App() {
	const [state, setState] = useState(null)
	const [fetching, setFetching] = useState({isLoading:true, data:'', error:null})
	const url = 'http://localhost:9000/'
	useEffect(()=>{
		const formData = new FormData()
		if(state){
			for(let one of state){
				formData.append('myImage', one, one.name)
			}
			
			const config = {
				headers: {
					'content-type': 'multipart/form-data'
				}
			}
			axios.post(url,formData,config)
				 .then(function (response) {
					setFetching({
						data: response.data,
						isLoading: false,
					  })
				 })
				 .catch(function (error) {
					setFetching({
						error:error,
						isLoading: false,
					  })
				 });
		}
        
      
	},[state])
  return (
    <>
		<article>
			<h3 className="heading">imgs<span>2</span>vid</h3>
			<Dropzone onDrop={acceptedFiles => setState(acceptedFiles)}>
					{({getRootProps, getInputProps}) => (
						<section>
							{!state ?
								<div className="input-div" {...getRootProps()}>
									<input {...getInputProps()} />
									<p>Drop images here</p>
								</div>
						
							: 
							!fetching.isLoading ? (
								<div className="video-container">
									<video controls="true" autoplay="true" name="media" width="600">
										<source src={fetching.data.nameVideo ? ("http://localhost:9000/"+ fetching.data.nameVideo): null }type="video/mp4"/>
									</video>
								</div>
							) : (
								<Loader className="spin" type="TailSpin" color="#3D7FFF" height={100} width={100}  />
							)
							}
			
							{fetching.error ? <p>{fetching.error.message}</p> : null}
						</section>
					)}
			</Dropzone> 
		</article>
		
	
		
    </>
  );
}

export default App;
