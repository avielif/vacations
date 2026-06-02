import React, {JSX, useEffect, useState} from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Vacation } from "../../models/vacation";
import {vacationService} from "../../services/vacation-service";
import './Report.css';

function Report(): JSX.Element {

    let [vacationList, setVacationList] = useState<Vacation[]>([]);
    let [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getAllVacations(){
            const vacations: Vacation[] = await vacationService.getAllVacationList();
            setVacationList(vacations);
            setLoading(false);
        }
        getAllVacations();
    }, []);



    return (
        <div className="report">
            {loading ? <p className="p-loading">loading...</p> : vacationList.length === 0 ? <p className="p-no-vacations">No Vacations to Show</p>
            :<>
                <div className="report-card">
                    <Bar
                        data={{
                            labels: vacationList.map((v) => v.destination),
                            datasets: [
                                {
                                    label: "Number Of Followers",
                                    data: vacationList.map((v) => v.numberOfFollowers ?? 0),
                                    backgroundColor: "#323252",
                                    borderColor: "#323252",
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: "top",
                                    labels: {
                                        color: "#323252",
                                        font: {
                                            size: 14,
                                            weight: "bold",
                                        },
                                    },
                                },
                                title: {
                                    display: true,
                                    text: "Vacations Report",
                                    color: "#323252",
                                    font: {
                                        size: 20,
                                        weight: "bold",
                                    },
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        color: "#323252",
                                        font: {
                                            size: 14,
                                            weight: "bold",
                                        },
                                        precision: 0,
                                    },
                                    grid: {
                                        color: 'rgba(0,0,0,0.08)'
                                    },
                                },
                                x: {
                                    ticks: {
                                        color: "#323252",
                                        maxRotation: 83,
                                        minRotation: 83,
                                        font: {
                                            size: 11,
                                            weight: "bold",
                                        },
                                    },
                                    grid: {
                                        color: 'rgba(0,0,0,0.08)'
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </>
            }
        </div>
    );
}

export default Report;
