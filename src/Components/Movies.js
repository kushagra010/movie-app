import React, { Component } from 'react';
import {getMovies} from './getMovies';
import axios from 'axios';

export default class Movies extends Component {
    constructor(){
        super();
        this.state={
            movies: [],
            currSearchText: "",
            currPage: 1,
            limit: 4,
            genres: [{ _id: 'abcd', name: 'All Genres' }],
            cGenre: 'All Genres'
        }
    }

    async componentDidMount(){
        let res = await axios.get('https://backend-react-movie.herokuapp.com/movies');
        let genreRes=await axios.get('https://backend-react-movie.herokuapp.com/genres')
        this.setState({
            movies: res.data.movies,
            genres: [...this.state.genres,...genreRes.data.genres]
        })
    }

    onDelete=(id)=>{
        let newMovies=this.state.movies.filter(function(movieObj){
            return movieObj._id!==id
        })
        this.setState({
            movies: newMovies
        })
    }

    handleChange=(e)=>{
        let val=e.target.value;
        this.setState({
            currSearchText: val,
        })
    }

    sortByStock=(e)=>{
        let className=e.target.className;
        let narr=[];
        if(className==="fa fa-sort-asc"){
            narr=this.state.movies.sort((a,b)=>{
                return a.numberInStock-b.numberInStock;
            })
        }else{
            narr=this.state.movies.sort((a,b)=>{
                return b.numberInStock-a.numberInStock;
            })
        } 
        this.setState({
            movies: narr
        })
    }

    sortByRating=(e)=>{
        let className=e.target.className;
        let narr=[];
        if(className==="fa fa-sort-asc"){
            narr=this.state.movies.sort((a,b)=>{
                return a.dailyRentalRate-b.dailyRentalRate;
            });
        }else{
            narr=this.state.movies.sort((a,b)=>{
                return b.dailyRentalRate-a.dailyRentalRate;
            })
        }
        this.setState({
            movies: narr
        })
    }

    handleLimit=(e)=>{
        let newLimit=e.target.value;
        this.setState({
            limit: newLimit
        })
    }

    handlePageChange=(pageNumber)=>{
        this.setState({
            currPage: pageNumber
        })
    }

    handleGenreChange=(genre)=>{
        this.setState({
            cGenre: genre
        })
    }

    render() {
        let {movies,currSearchText,currPage,limit,genres,cGenre}=this.state;
        let filteredArr=[];
        if(currSearchText===""){
            filteredArr=movies
        }else{
            filteredArr=movies.filter(function(movieObj){
                let title=movieObj.title.toLowerCase();
                return title.includes(currSearchText.toLowerCase());
            })
        }

        if(cGenre!='All Genres')
        {
            filteredArr = filteredArr.filter(function(movieObj){
                return movieObj.genre.name==cGenre
            })
        }

        let numberofPages=Math.ceil(filteredArr.length/limit);
        let pageNumberArr=[];
        for(let i=0;i<numberofPages;i++){
            pageNumberArr.push(i+1);
        }
        let si=(currPage-1)*limit;
        let ei=si+limit;
        filteredArr=filteredArr.slice(si,ei);
        return (

            <>
            { this.state.movies.length==0 ? <div className="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div> : 
                <div className="container">
                    <div className="row">
                        <div className="col-3">
                            <ul className="list-group">
                                {
                                    genres.map((genreObj)=>(
                                        <li onClick={()=>this.handleGenreChange(genreObj.name)} key={genreObj._id} className='list-group-item'>
                                            {genreObj.name}
                                        </li>
                                    ))
                                }
                            </ul>
                            <h5>Current Genre : {cGenre}</h5>
                        </div>
                        <div className="col-9">
                            <input type="search" value={this.state.currSearchText} onChange={this.handleChange}></input>
                            <input type="number" value={this.state.limit} onChange={this.handleLimit}></input>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Genre</th>
                                        <th scope="col">
                                            <i className="fa fa-sort-asc" aria-hidden="true" onClick={this.sortByStock}></i>
                                            Stock
                                            <i className="fa fa-sort-desc" aria-hidden="true" onClick={this.sortByStock}></i>
                                        </th>
                                        <th scope="col">
                                            <i className="fa fa-sort-asc" aria-hidden="true" onClick={this.sortByRating}></i>
                                            Rate
                                            <i className="fa fa-sort-desc" aria-hidden="true" onClick={this.sortByRating}></i>
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredArr.map((movieObj)=>{
                                            return(
                                                <tr scope="row" key={movieObj._id}>
                                                    <td></td>
                                                    <td>{movieObj.title}</td>
                                                    <td>{movieObj.genre.name}</td>
                                                    <td>{movieObj.numberInStock}</td>
                                                    <td>{movieObj.dailyRentalRate}</td>
                                                    <td><button type="button" className="btn btn-danger" onClick={()=>{
                                                        this.onDelete(movieObj._id)
                                                    }} >Delete</button></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <nav aria-label="...">
                                <ul className="pagination">
                                    {
                                        pageNumberArr.map((pageNumber) => {
                                            let classStyle = pageNumber === currPage ? 'page-item active' : 'page-item';
                                            return (
                                                <li key={pageNumber} onClick={() => this.handlePageChange(pageNumber)} className={classStyle}><span className="page-link">{pageNumber}</span></li>
                                            )
                                        })
                                    }
                                </ul>
                            </nav>
                        </div> 
                    </div> 
                </div>
            }
            </>
        )
    }
}
