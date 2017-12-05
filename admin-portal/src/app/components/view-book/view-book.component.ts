import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { GetBookService } from '../../service/get-book.service';
import { Book } from '../../models/book';

@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css']
})
export class ViewBookComponent implements OnInit {

  private book = new Book();
  private bookId: number;
  
  
  constructor(private getBookService: GetBookService, private route: ActivatedRoute, private router: Router) { }
  
  onSelect(book: Book){
	  this.router.navigate(['/editBook',this.book.bookId])
	  //.then(res => location.reload())
	  ;
	  
  }

  ngOnInit() {
	  this.route.params.forEach((params: Params) => {
		  this.bookId = Number.parseInt(params['id']);
	  });
	  
	  this.getBookService.getBook(this.	bookId).subscribe(
		res => {
			this.book = res.json();
			this.book.publicationDate = new Date(this.book.publicationDate).toISOString().slice(0,10);
		},
		error => {
			console.log(error);
		}
	  );
  }

}
