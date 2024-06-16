// src/components/LocationScout.jsx
import React, { useState, useEffect } from 'react';
import { firestore, auth, storage } from '../firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import './LocationScout.css';

const LocationScout = () => {
  const { projectId } = useParams();
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});
  const user = auth.currentUser;

  useEffect(() => {
    const fetchLocations = async () => {
      const q = query(collection(firestore, 'projects', projectId, 'locations'));
      const querySnapshot = await getDocs(q);
      const locationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLocations(locationsData);
    };

    fetchLocations();
  }, [projectId]);

  const handleAddLocation = async () => {
    try {
      const locationDocRef = await addDoc(collection(firestore, 'projects', projectId, 'locations'), {
        name: newLocation,
        imageUrls: [],
        comments: []
      });

      const imageUrls = [];
      for (const image of newImages) {
        const imageRef = ref(storage, `locations/${locationDocRef.id}/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        imageUrls.push(imageUrl);
      }

      await updateDoc(locationDocRef, {
        imageUrls,
      });

      setLocations([...locations, { id: locationDocRef.id, name: newLocation, imageUrls, comments: [] }]);
      setNewLocation('');
      setNewImages([]);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleAddComment = async (locationId) => {
    try {
      const locationDocRef = doc(firestore, 'projects', projectId, 'locations', locationId);
      const locationDoc = await getDoc(locationDocRef);

      const updatedComments = locationDoc.data().comments || [];
      updatedComments.push({ text: newComment, user: user.email });

      await updateDoc(locationDocRef, { comments: updatedComments });

      setComments({ ...comments, [locationId]: updatedComments });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="location-scout-container">
      <h3>Location Scout</h3>
      {(user?.email === 'sumit@mass-studios.com' || user?.role === 'head' || user?.role === 'crew') && (
        <div className="add-location-form">
          <input
            type="text"
            placeholder="Location Name"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <input
            type="file"
            multiple
            onChange={(e) => setNewImages([...e.target.files])}
          />
          <button onClick={handleAddLocation}>Add Location</button>
        </div>
      )}
      <div className="locations-list">
        {locations.map((location) => (
          <div key={location.id} className="location-item">
            <h4>{location.name}</h4>
            {location.imageUrls && location.imageUrls.map((url, index) => (
              <img key={index} src={url} alt={location.name} />
            ))}
            <div className="comments-section">
              <h5>Comments</h5>
              <ul>
                {location.comments && location.comments.map((comment, index) => (
                  <li key={index}>{comment.user}: {comment.text}</li>
                ))}
              </ul>
              {user?.role === 'client' && (
                <div className="add-comment-form">
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button onClick={() => handleAddComment(location.id)}>Add Comment</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationScout;
