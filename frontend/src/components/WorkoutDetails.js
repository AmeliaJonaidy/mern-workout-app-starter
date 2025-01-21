import { useState } from 'react';
import { useWorkoutsContext } from "../hooks/useWorkoutContext";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {
    const { dispatch } = useWorkoutsContext();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedWorkout, setUpdatedWorkout] = useState({
        title: workout.title,
        load: workout.load,
        reps: workout.reps,
    });

    const handleDelete = async () => {
        const response = await fetch('api/workouts/' + workout._id, {
            method: 'DELETE',
        });
        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_WORKOUT', payload: json });
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setUpdatedWorkout({ ...updatedWorkout, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('api/workouts/' + workout._id, {
            method: 'PATCH',
            body: JSON.stringify(updatedWorkout),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'UPDATE_WORKOUT', payload: json });
            setIsEditing(false); // Hide the edit form
        }
    };

    return (
        <div className="workout-details">
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        value={updatedWorkout.title}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="load"
                        value={updatedWorkout.load}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="reps"
                        value={updatedWorkout.reps}
                        onChange={handleChange}
                    />
                    <button type="submit">Save Changes</button>
                </form>
            ) : (
                <>
                    <h4>{workout.title}</h4>
                    <p><strong>Load (kg):</strong>{workout.load}</p>
                    <p><strong>Reps:</strong>{workout.reps}</p>
                    <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
                    <button onClick={handleEditClick}>Edit Workout ✏️</button>
                    <span onClick={handleDelete}>🗑️</span>
                </>
            )}
        </div>
    );
};

export default WorkoutDetails;
