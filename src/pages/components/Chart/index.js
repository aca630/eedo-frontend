
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


export const options = {
  responsive: true,
  maintainAspectRation:false,
 
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: " Bar Chart",
    },
  },
};




export const data = {
  labels: ['Gross', 'Hits', 'Kabig'],
  datasets: [
    {
      label: 'data',
      data: [12, 19, 33],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export default function ChartComponent(props) {

  const {PremiumData,UnleadedData,DieselData,isFetching} = props;

  
  console.log(PremiumData,isFetching,' BOOOM');



return (
  <div className="" style={{ minHeight: 400 }}>
    <Pie options={options} data={data} height={50} />
  </div>
);
}
