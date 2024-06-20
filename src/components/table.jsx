import React, { useState, useEffect, useRef, useCallback } from 'react';
import logo from "../unnamed.png"

const Table = ({ collegeList }) => {
    const [colleges, setColleges] = useState(collegeList);
    const [visibleColleges, setVisibleColleges] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const [sortOrder, setSortOrder] = useState({
        field: null,
        ascending: true
    });
    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 7;

    useEffect(() => {
        setColleges(collegeList);
        setVisibleColleges(collegeList.slice(0, itemsPerPage));
    }, [collegeList]);

    const loadMoreColleges = () => {
        if (loading || !hasMore) return;

        setLoading(true);
        setTimeout(() => {
            const newPage = page + 1;
            const newVisibleColleges = colleges.slice(0, newPage * itemsPerPage);

            setVisibleColleges(newVisibleColleges);
            setPage(newPage);
            setHasMore(newVisibleColleges.length < colleges.length);
            setLoading(false);
        }, 1000); // Simulate a network request
    };

    const lastCollegeElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreColleges();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        const filteredColleges = collegeList.filter(college =>
            college.collegeName.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setColleges(filteredColleges);
        setVisibleColleges(filteredColleges.slice(0, itemsPerPage));
        setPage(1);
        setHasMore(filteredColleges.length > itemsPerPage);
    };

    const handleSort = (field) => {
        let sortedColleges = [...colleges];
        const isAscending = field === sortOrder.field ? !sortOrder.ascending : true;
        setSortOrder({ field, ascending: isAscending });

        switch (field) {
            case "cdRank":
                sortedColleges.sort((a, b) => isAscending ? a.cdRank - b.cdRank : b.cdRank - a.cdRank);
                break;
            case "fees":
                sortedColleges.sort((a, b) => isAscending ? a.courseFees - b.courseFees : b.courseFees - a.courseFees);
                break;
            case "rating":
                sortedColleges.sort((a, b) => isAscending ? a.userReview - b.userReview : b.userReview - a.userReview);
                break;
            default:
                sortedColleges.sort((a, b) => isAscending ? a.rank - b.rank : b.rank - a.rank);
                break;
        }
        setColleges(sortedColleges);
        setVisibleColleges(sortedColleges.slice(0, itemsPerPage * page));
    };

    return (
        <div>
            <div className='app-header'>
                <div className='search'>
                    <input
                        type='text'
                        placeholder='Search college'
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
                    />
                </div>
            </div>
            <div className='table-header'>
                <div className='headings header border' style={{ width: "8%" }} onClick={() => handleSort("cdRank")}>CD Rank</div>
                <div className='headings header border' style={{ width: "38.6%" }}>Colleges</div>
                <div className='headings header border' style={{ width: "12.5%" }} onClick={() => handleSort("fees")}>Course Fees</div>
                <div className='headings header border' style={{ width: "12.5%" }}>Placement</div>
                <div className='headings header border' style={{ width: "12.5%" }} onClick={() => handleSort("rating")}>User Review</div>
                <div className='headings header border' style={{ width: "12.5%" }} onClick={() => handleSort("rank")}>Ranking</div>
            </div>
            {
                visibleColleges.map((p, index) => {
                    return (
                        <div className={p.featured?`table-header featured`:"table-header" } key={index} ref={index === visibleColleges.length - 1 ? lastCollegeElementRef : null}>
                            <div className='headings border' style={{ width: "8%" }}>#{p.cdRank}</div>
                            <div className= {p.featured?`headings row border m-0 featured`:"headings row border m-0" }  style={{ width: "38.6%" }}>
                                {p.featured?
                                <div className=' col-12 ' >
                                    <div className='featured-box' style={{backgroundColor:"pink"}}>  Featured</div>
                                  
                                </div>
                                :""}
                                <div className={p.featured?`col-1 mt-3 p-0`:"col-1 m-0 p-0"}>
                                    <img src={p.image} width="30px" alt='logo' />
                                </div>
                                <div className={p.featured?`col-11 mt-3 p-0`:'col-11 p-0'}>
                                    <p style={{ color: "#1ebcea", fontSize:"14px" }} className='mb-0'><b>{p.collegeName}</b></p>
                                    <small>{p.location}</small>
                                </div>
                                <div className='col-1 mt-2 p-0'></div>
                                <div className='col-11 mt-2 p-0'>
                                    <div className='course'>
                                        <span style={{ color: 'orange', fontWeight: "bold" }}>{p.course}
                                            <i class="fa-solid fa-chevron-down ms-1"></i>
                                        </span><br />
                                        <span>JEE Advanced 2023 Cutoff : {p.cutoff}</span>
                                        
                                    </div>
                                </div>
                                <div className='col-4 mt-3  mb-3 apply'>
                                    <i class="fa-solid fa-arrow-right me-1"></i>
                                    Apply Now
                                </div>
                                <div className='col-4 mt-3  mb-3 download' style={{ textAlign: "center" }}>
                                    <i class="fa fa-download me-1" aria-hidden="true"></i>
                                    Download Brochure
                                </div>
                                <div className='col-4 mt-3 mb-3' style={{ textAlign: "right" , fontWeight:"bold" }}>
                                    <input type='checkbox' className='me-1'/>
                                    Add to compare
                                </div>
                            </div>
                            <div className='headings row m-0 border ' style={{ width: "12.5%" , paddingBottom:"50px"}}>
                                <div className='col-12 rupees' ><b>&#8377; {p.courseFees.toLocaleString()}</b></div>
                                <div className='col-12' style={{height:"fit-content"}}><small>BE/B.Tech</small></div>
                                <div className='col-12'><small> - 1st Years Fees</small></div>
                                <div className='col-12 apply'><i class="fa-solid fa-down-left-and-up-right-to-center me-1"></i>Compare Fees</div>
                            </div>
                            <div className='headings border' style={{ width: "12.5%" }}>
                                <div className='col-12 rupees'><b>&#8377; {p.avgPackage.toLocaleString()}</b></div>
                                <div className='col-12'><small>Average Package</small></div>
                                <div className='col-12 rupees'><b>&#8377; {p.highPackage.toLocaleString()}</b></div>
                                <div className='col-12'><small>High Package</small></div>
                                <div className='col-12 apply'><i class="fa-solid fa-down-left-and-up-right-to-center me-1 arrow"></i>Compare Placement</div>
                            </div>
                            <div className='headings border' style={{ width: "12.5%" }}>
                                <div><i class="fa-solid fa-circle" style={{color:'orange', fontSize:"7px"}}></i> {p.userReview}/10</div>
                                <div style={{width:"70%"}}><small>Based on {p.totalUser} User Review</small></div>
                                <div className='social'><small><i class="fa-solid fa-check me-2"></i>Best in social life<i class="fa-solid fa-chevron-down ms-2"></i></small></div>
                            </div>
                            <div className='headings border' style={{ width: "12.5%" }}>
                                <div className='col-12'>
                                    #{p.rank}<span>rd</span>/<span className='apply'>{p.totalRank}</span> in India
                                </div>
                                <div className="col-12"><img src={logo}  width="20%" /> 2023</div>
                                <div className="col-12 voter"><small><img src={logo}  width="10%" /> + 9 More<i class="fa-solid fa-chevron-down ms-2"></i></small></div>
                            </div>
                        </div>
                    );
                })
            }
            {loading && <p>Loading more colleges...</p>}
        </div>
    );
};

export default Table;
