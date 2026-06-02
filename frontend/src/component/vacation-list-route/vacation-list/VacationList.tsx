import React, {JSX, useEffect, useRef, useState} from "react";
import {Vacation} from "../../../models/vacation";
import {vacationService} from "../../../services/vacation-service";
import VacationItem from "./vacation-item/VacationItem";
import './VacationList.css'
import {vacationStore} from "../../../state/vacation-state";
import {useNavigate, useLocation, useSearchParams} from "react-router-dom";
import {authStore} from "../../../state/auth-state";
import {followerService} from "../../../services/follower-service";
import {Follower} from "../../../models/follower";
import {followerStore} from "../../../state/follower-state";
import {RoleId} from "../../../models/enums";
import {errorMessageService} from "../../../services/error-message-service";

function VacationList(): JSX.Element {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    let [vacationList, setVacationList] = useState<Vacation[]>([]);
    let [loading, setLoading] = useState<boolean>(true);
    let [followerList, setFollowerList] = useState<Follower[]>([]);
    let [pagesList, setPagesList] = useState<number[]>([]);
    let [currentPage, setCurrentPage] = useState(1);
    const [userId, setUserId] = useState(authStore.getState().user?.id);
    const [filter, setFilter] = useState<string | null>(null);

    let numberOfVacations = 0;
    let numberOfPages = 0;
    const pageLimit = 10;
    let isFilteredVacations = useRef<boolean>(false);

    // tracks user changes (login / logout)
    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setUserId(authStore.getState().user?.id);
        });
        return () => unsubscribe();
    }, []);

    // Store subscriptions — once on mount only
    useEffect(() => {
        const subscriptions = [
            vacationStore.subscribe(() => {
                setVacationList(vacationStore.getState().vacationList);
            }),
            followerStore.subscribe(() => {
                setFollowerList(followerStore.getState().followerList);
            }),
        ];
        return () => subscriptions.forEach(unsubscribe => unsubscribe());
    }, []);

    // Combined init — runs on mount, userId change, or reset navigation
    useEffect(() => {
        if (!userId) return;
        if (location.state && !location.state?.reset) return; // ignore unrelated state changes

        const filterParam = searchParams.get("filter");   // "my", "future", "active", or null
        const pageParam = Number(searchParams.get("page")) || 1;

        setFilter(filterParam);
        isFilteredVacations.current = !!filterParam;
        setCurrentPage(pageParam);

        async function init() {
            if (filterParam) {
                switch (filterParam) {
                    case "my-vacations":
                        const countFollowed = await vacationService.getFollowedVacationsCountByUserId(userId!);
                        setPagesArray(Math.ceil(countFollowed / pageLimit));
                        break;
                    case "future-vacations":
                        const countFuture = await vacationService.getFutureVacationsCount();
                        setPagesArray(Math.ceil(countFuture / pageLimit));
                        break;
                    case "active-vacations":
                        const countActive = await vacationService.getActiveVacationsCount();
                        setPagesArray(Math.ceil(countActive / pageLimit));
                        break;
                }
                await onFilteredPage(pageParam, filterParam);
            } else {
                await getVacationsListCount();
                await onPage(pageParam);
            }
            await getFollowerListByUserId(userId!);
        }

        init();

    }, [userId, location.state]);

    async function getVacationList(offset: number, forceFetch: boolean) {
        try {
            vacationList = await vacationService.getVacationList(offset, forceFetch);
            setVacationList(vacationList);
            setLoading(false);
        }
        catch (error) {
            errorMessageService.displayErrorMessage(error);
        }
    }

    async function getVacationsListCount() {
        try {
            numberOfVacations = await vacationService.getVacationsCount();
            numberOfPages = Math.ceil(numberOfVacations / pageLimit);
            setPagesArray(numberOfPages);
        }
        catch (error) {
            errorMessageService.displayErrorMessage(error);
        }
    }

    function setPagesArray(numberOfPages: number) {
        const pages: number[] = [];
        for (let i = 1; i <= numberOfPages; i++) {
            pages.push(i);
        }
        setPagesList([...pages]);
    }

    async function onPage(pageNumber: number) {
        const offset = (pageNumber-1) * pageLimit;
        await getVacationList(offset, true);
        navigate("/vacations-list?page=" + pageNumber);
    }

    async function getFollowerListByUserId(userId: number) {
        try {
            followerList = await followerService.getFollowerListByUserId(userId);
            setFollowerList(followerList);
        }
        catch (error) {
            errorMessageService.displayErrorMessage(error);
        }
    }

    async function getFollowedVacationList(userId: number, offset: number) {
        try {
            const list = await vacationService.getFollowedVacationsListByUserId(userId, offset);
            setVacationList(list);
            setLoading(false);
        }
        catch (error) {
            errorMessageService.displayErrorMessage(error);
        }
    }

    async function getFutureVacationsList(offset: number) {
        try {
            const list = await vacationService.getFutureVacationsList(offset);
            setVacationList(list);
            setLoading(false);
        } catch (error) {
            errorMessageService.displayErrorMessage(error);
        }
    }

    async function getActiveVacationsList(offset: number) {
        try {
            const list = await vacationService.getActiveVacationsList(offset);
            setVacationList(list);
            setLoading(false);
        } catch (error) {
            errorMessageService.displayErrorMessage(error);
        }
    }

    async function onFilteredPage(pageNumber: number, filterValue: string) {
        const offset = (pageNumber - 1) * pageLimit;
        switch (filterValue) {
            case "my-vacations":
                await getFollowedVacationList(userId!, offset);
                break;
            case "future-vacations":
                await getFutureVacationsList(offset);
                break;
            case "active-vacations":
                await getActiveVacationsList(offset);
                break;
        }
        navigate("/vacations-list?filter=" + filterValue + "&page=" + pageNumber);
    }

    async function handleFilter(value: string): Promise<void> {
        const newFilter = filter === value ? null : value;  // compute new value first
        setFilter(newFilter);
        setCurrentPage(1);

        switch (newFilter) {
            case "my-vacations":
                isFilteredVacations.current = true;
                const countFollowed = await vacationService.getFollowedVacationsCountByUserId(userId!);
                setPagesArray(Math.ceil(countFollowed / pageLimit));
                await getFollowerListByUserId(userId!);
                await onFilteredPage(1, newFilter);
                break;
            case "future-vacations":
                isFilteredVacations.current = true;
                const countFuture = await vacationService.getFutureVacationsCount();
                setPagesArray(Math.ceil(countFuture / pageLimit));
                await getFollowerListByUserId(userId!);
                await onFilteredPage(1, newFilter);
                break;
            case "active-vacations":
                isFilteredVacations.current = true;
                const countActive = await vacationService.getActiveVacationsCount();
                setPagesArray(Math.ceil(countActive / pageLimit));
                await getFollowerListByUserId(userId!);
                await onFilteredPage(1, newFilter);
                break;
            case null:
            // restore normal list when unchecking
                isFilteredVacations.current = false;
                await getVacationsListCount();
                await onPage(1);
                await getFollowerListByUserId(userId!);
                break;
        }

    }

    return (
        <div className="VacationList">
            {/*<div className="checkboxs">*/}
            {/*    {authStore.getState().user?.roleId === RoleId.User ?*/}
            {/*        <div><input type="checkbox" checked={filter === "my-vacations"} onChange={() => handleFilter("my-vacations")}/><span>My Vacations</span></div>*/}
            {/*        : ""*/}
            {/*    }*/}
            {/*    <div><input type="checkbox" checked={filter === "future-vacations"} onChange={() => handleFilter("future-vacations")}/><span>Future Vacations</span></div>*/}
            {/*    <div><input type="checkbox" checked={filter === "active-vacations"} onChange={() => handleFilter("active-vacations")}/><span>Active Vacations</span></div>*/}
            {/*</div>*/}
            <div className="radio-buttons">
                {authStore.getState().user?.roleId === RoleId.User &&
                    <label><input type="radio" name="filter" checked={filter === "my-vacations"} onChange={() => handleFilter("my-vacations")}/><span>My Vacations</span></label>
                }
                <label><input type="radio" name="filter" checked={filter === "future-vacations"} onChange={() => handleFilter("future-vacations")}/><span>Future Vacations</span></label>
                <label><input type="radio" name="filter" checked={filter === "active-vacations"} onChange={() => handleFilter("active-vacations")}/><span>Active Vacations</span></label>
                <button disabled={filter === null} onClick={() => handleFilter(filter!)}>Clear Filter</button>
            </div>
            {
                loading ? <p className="p-loading">loading...</p> : vacationList.length === 0 ? <p className="p-no-vacations">No Vacations to Show</p> :<>
                <div className="vacationCards">
                    {vacationList.map(vacation => <VacationItem vacation={vacation} isFollower={followerStore.getState().followerList.some(f => f.userId === authStore.getState().user?.id && f.vacationId === vacation.id)} key={vacation.id}/>)}
                </div>
            <nav className="pagination">
                {pagesList.map((item) =>
                    <button className={item === currentPage ? "active" : ""}
                            onClick={() => {
                                if (item === currentPage) return;
                                setCurrentPage(item);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                isFilteredVacations.current ? onFilteredPage(item, filter!) : onPage(item);}
                            }
                            key={item}>{item}</button> )}
            </nav></>
            }
        </div>
    )
}

export default VacationList;
