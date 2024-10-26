import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './Dashboard.css';

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const [loginHistory, setLoginHistory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [goals, setGoals] = useState([]);

  const [newActivity, setNewActivity] = useState({ name: '', duration: '', caloriesBurned: '' });
  const [newNutrition, setNewNutrition] = useState({ meal: '', calories: '' });
  const [newGoal, setNewGoal] = useState({ goal: '', status: '' });

  const fetchData = async () => {
    try {
      const loginHistoryResponse = await axios.get('http://localhost:5000/login-history');
      const activitiesResponse = await axios.get('http://localhost:5000/activities');
      const nutritionResponse = await axios.get('http://localhost:5000/nutrition');
      const goalsResponse = await axios.get('http://localhost:5000/goals');

      setLoginHistory(loginHistoryResponse.data);
      setActivities(activitiesResponse.data);
      setNutrition(nutritionResponse.data);
      setGoals(goalsResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const addActivity = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/activities', newActivity);
    setNewActivity({ name: '', duration: '', caloriesBurned: '' });
    fetchData(); // Refresh the activities list
  };

  const addNutrition = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/nutrition', newNutrition);
    setNewNutrition({ meal: '', calories: '' });
    fetchData(); // Refresh the nutrition list
  };

  const addGoal = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/goals', newGoal);
    setNewGoal({ goal: '', status: '' });
    fetchData(); // Refresh the goals list
  };

  // Prepare data for charts
  const activityChartData = {
    labels: activities.map(activity => activity.name),
    datasets: [
      {
        label: 'Calories Burned',
        data: activities.map(activity => activity.caloriesBurned),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const nutritionChartData = {
    labels: nutrition.map(meal => meal.meal),
    datasets: [
      {
        label: 'Calories Consumed',
        data: nutrition.map(meal => meal.calories),
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const goalsCompletion = goals.reduce((acc, goal) => {
    acc[goal.status] = (acc[goal.status] || 0) + 1;
    return acc;
  }, {});

  const goalsChartData = {
    labels: Object.keys(goalsCompletion),
    datasets: [
      {
        label: 'Goals Status',
        data: Object.values(goalsCompletion),
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Health and Fitness Dashboard</h2>

      <section>
        <h4>Login History</h4>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Login Time</th>
            </tr>
          </thead>
          <tbody>
            {loginHistory.length > 0 ? (
              loginHistory.map((event, index) => (
                <tr key={index}>
                  <td>{event.username}</td>
                  <td>{new Date(event.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>No login history available</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h4>Your Activities</h4>
        <ul>
          {activities.map(activity => (
            <li key={activity.id}>
              {activity.name}: {activity.duration} - {activity.caloriesBurned} calories burned
            </li>
          ))}
        </ul>
        <form onSubmit={addActivity}>
          <input
            type="text"
            placeholder="Activity Name"
            value={newActivity.name}
            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Duration"
            value={newActivity.duration}
            onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Calories Burned"
            value={newActivity.caloriesBurned}
            onChange={(e) => setNewActivity({ ...newActivity, caloriesBurned: e.target.value })}
            required
          />
          <button type="submit">Add Activity</button>
        </form>
      </section>

      <section>
        <h4>Your Nutrition</h4>
        <ul>
          {nutrition.map(meal => (
            <li key={meal.id}>
              {meal.meal}: {meal.calories} calories
            </li>
          ))}
        </ul>
        <form onSubmit={addNutrition}>
          <input
            type="text"
            placeholder="Meal"
            value={newNutrition.meal}
            onChange={(e) => setNewNutrition({ ...newNutrition, meal: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Calories"
            value={newNutrition.calories}
            onChange={(e) => setNewNutrition({ ...newNutrition, calories: e.target.value })}
            required
          />
          <button type="submit">Add Nutrition</button>
        </form>
      </section>

      <section>
        <h4>Your Goals</h4>
        <ul>
          {goals.map(goal => (
            <li key={goal.id}>
              {goal.goal}: {goal.status}
            </li>
          ))}
        </ul>
        <form onSubmit={addGoal}>
          <input
            type="text"
            placeholder="Goal"
            value={newGoal.goal}
            onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Status"
            value={newGoal.status}
            onChange={(e) => setNewGoal({ ...newGoal, status: e.target.value })}
            required
          />
          <button type="submit">Add Goal</button>
        </form>
      </section>

      <section>
        <h4>Activity Chart</h4>
        <Bar data={activityChartData} />
      </section>

      <section>
        <h4>Nutrition Chart</h4>
        <Pie data={nutritionChartData} />
      </section>

      <section>
        <h4>Goals Status Chart</h4>
        <Bar data={goalsChartData} />
      </section>
    </div>
  );
}

export default Dashboard;


