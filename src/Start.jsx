import { Button, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FILES } from './file-list';

function Start() {
    const [loading, setLoading] = useState(true);
    const [cacheProcess, setCacheProcess] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    
    useEffect(() => {
        // Check the service worker status
        if ('serviceWorker' in navigator) {
            // Check if the service worker is currently installing, if so, skip the below checking
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration && registration.installing) {
                    // Check if the type CACHE_DONE message is received from the service worker
                    // if so, set loading to false
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        // Listen to CACHE_PROGRESS message from the service worker
                        if (event.data.type === 'CACHE_PROGRESS') {
                            setCacheProcess(event.data.pct);
                        }
                        if (event.data.type === 'CACHE_DONE') {
                            setLoading(false);
                        }
                    });
                } else if (registration && !registration.installing) {
                    // Check if all the FILES are cached
                    const cache = caches.open('vr-videos-v1');
                    cache.then((cache) => {
                        cache.keys().then((keys) => {
                            const cachedFiles = keys.map(request => request.url);
                            const allCached = FILES.every(file => cachedFiles.includes(file));
                            if (allCached) {
                                setLoading(false);
                            } else {
                                // If not all files are cached, unregister the service worker and register it again
                                registration.unregister().then(() => {
                                    navigator.serviceWorker.register('/service-worker.js')
                                        .then(() => {
                                            console.log('Service Worker registered');
                                            // Check if the type CACHE_DONE message is received from the service worker
                                            // if so, set loading to false
                                            
                                            navigator.serviceWorker.addEventListener('message', (event) => {
                                                if (event.data.type === 'CACHE_PROGRESS') {
                                                    setCacheProcess(event.data.pct);
                                                }
                                                if (event.data.type === 'CACHE_DONE') {
                                                    setLoading(false);
                                                }
                                            });

                                        })
                                        .catch((error) => {
                                            console.error('Service Worker registration failed:', error);
                                        });
                                });
                            }
                        });
                    });
                } else {
                    // If no service worker is registered, register it
                    navigator.serviceWorker.register('/service-worker.js')
                        .then(() => {
                            console.log('Service Worker registered');
                            // Check if the type CACHE_DONE message is received from the service worker
                            // if so, set loading to false
                            navigator.serviceWorker.addEventListener('message', (event) => {
                                if (event.data.type === 'CACHE_PROGRESS') {
                                    setCacheProcess(event.data.pct);
                                }
                                if (event.data.type === 'CACHE_DONE') {
                                    setLoading(false);
                                }
                            });

                        })
                        .catch((error) => {
                            console.error('Service Worker registration failed:', error);
                            errorMsg += 'Service Worker registration failed: ' + error + '\n';
                            setErrorMsg(errorMsg);
                        });
                }
            }).catch((error) => {
                console.error('Service Worker registration failed:', error);
                errorMsg += 'Service Worker registration failed: ' + error + '\n';
            });
        

        }
        
    }, []);
    
    return (
        <div className="start">
            <h1>Mozart: Piano Sonata F major, KV 332 - 3rd. Movement</h1>
        {loading ? (
            <div className="loading-screen">
                
                <LinearProgress variant="determinate" value={cacheProcess} 
                    style={{ width: '80vw', height: '20px', marginTop: '20px', borderRadius: '10px' }} />
                    <div className="loading-text">Loading Content...{cacheProcess}%</div>
                    {cacheProcess === 0 && (
                    <p>Not seeing any progress increase? Try to refresh the page.</p>
                    )}
            </div>
        ) : (
            <>
                <p>
                <Link to="/vr_mode">
                    <Button variant="contained" color="primary" id="play">
                        Play Video
                    </Button>
                </Link>
                <span> </span>
                {/* Button to unregister service-worker w/ delete all caches */}
                <Button
                    variant="contained"
                    color="secondary"
                    id="offload"
                    onClick={() => {
                        if ('serviceWorker' in navigator) {
                            navigator.serviceWorker.getRegistrations().then((registrations) => {
                                registrations.forEach((registration) => {
                                    registration.unregister();
                                });
                            });
                            caches.keys().then((cacheNames) => {
                                cacheNames.forEach((cacheName) => {
                                    caches.delete(cacheName);
                                });
                            });
                            console.log('Service Worker unregistered and caches deleted');
                            document.getElementById('play').style.display = 'none';
                            document.getElementById('offload').style.display = 'none';
                            alert('All caches have been deleted. If you want to play the video again, please revisit the page. Closing the page now...');
                            // Go to about:blank
                            window.location.href = 'about:blank';

                        }
                    }}
                >
                    Offload Content
                </Button>
                </p>
                
            </>
        )}
        {errorMsg && (
            <div className="error-message">
                <p>Error: {errorMsg}</p>
            </div>
        )}
        </div>
    );
}

export default Start;