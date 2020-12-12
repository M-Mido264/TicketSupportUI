import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Status, Ticket } from "../models/Ticket";
import { User } from "../models/User";
import { TicketRepo } from "../repos/TicketRepo";
import { UserRepository } from "../repos/UserRepository";
import { AuthService } from "../services/AuthService";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [UserRepository, TicketRepo],
})
export class HomeComponent implements OnInit {
  Users: User[] = [];
  submitted: Boolean;
  InProgress: Boolean;
  Ticket: Ticket = new Ticket();
  @ViewChild("Form", { static: false })
  Form: NgForm;
  Tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  filter: number = null;
  filteruser: number = null;
  constructor(
    public authService: AuthService,
    private userRepo: UserRepository,
    private ticketRipo: TicketRepo,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log("user", this.authService.User);

    this.route.url.subscribe((res) => {
      //get tickets
      this.getTickets();

      // get users
      this.userRepo.getAll().subscribe(
        (res) => {
          console.log(
            "🚀 ~ file: home.component.ts ~ line 18 ~ HomeComponent ~ this.userRepo.getAll ~ res",
            res
          );
          this.Users = res;
        },
        (err) => {
          console.log(
            "🚀 ~ file: home.component.ts ~ line 21 ~ HomeComponent ~ this.userRepo.getAll ~ err",
            err
          );
        }
      );
    });
  }

  getTickets() {
    this.ticketRipo.getAll().subscribe(
      (res) => {
        this.Tickets = res;
        this.filteredTickets = res;
        console.log(
          "🚀 ~ file: home.component.ts ~ line 40 ~ HomeComponent ~ this.ticketRipo.getAll ~ res",
          res
        );
      },
      (err) => {
        console.log(
          "🚀 ~ file: home.component.ts ~ line 42 ~ HomeComponent ~ this.ticketRipo.getAll ~ err",
          err
        );
      }
    );
  }

  onLogout() {
    this.authService.Logout();
  }

  cancelDialog() {
    this.Ticket = new Ticket();
    this.dialog.closeAll();
  }

  open(content) {
    this.Ticket = new Ticket();
    this.dialog.open(content, {
      width: "60%",
      disableClose: true,
      autoFocus: true,
      panelClass: "dialogEn",
    });
  }

  FilterByName(val) {
    this.Tickets = this.filteredTickets.filter(
      (item) => item.Name.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
  }
  FilterByStatus(val) {
    console.log(
      "🚀 ~ file: home.component.ts ~ line 83 ~ HomeComponent ~ FilterByStatus ~ val",
      val
    );
    if (val > 0) {
      this.Tickets = this.filteredTickets.filter((x) => x.Status == val);
    } else {
      this.Tickets = this.filteredTickets;
    }
  }
  FilterByUser(val) {
    console.log(
      "🚀 ~ file: home.component.ts ~ line 83 ~ HomeComponent ~ FilterByUser ~ val",
      val
    );
    if (val > 0) {
      this.Tickets = this.filteredTickets.filter((x) => x.UserId == val);
    } else {
      this.Tickets = this.filteredTickets;
    }
  }
  getUserName(userID) {
    if (this.Users.length > 0) {
      const user = this.Users.find((x) => x.Id == userID);
      return user ? user.Name : "";
    }
  }
  getStatusName(status: Status) {
    if (status == Status.Active) {
      return "Active";
    }
    if (status == Status.Closed) {
      return "Closed";
    }
    if (status == Status.New) {
      return "New";
    }
    if (status == Status.Resolved) {
      return "Resolved";
    }
  }
  save() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
    var body = {
      Name: this.Ticket.Name,
      Content: this.Ticket.Content,
      UserId: this.authService.User.Id,
      Status: this.Ticket.Status,
    };
    this.Ticket.UserId = this.authService.User.Id;
    console.log(
      "🚀 ~ file: home.component.ts ~ line 64 ~ HomeComponent ~ save ~ this.Ticket",
      body
    );
    this.InProgress = true;
    this.ticketRipo.create(body).subscribe(
      (res) => {
        this.getTickets();
        this.reset();
      },
      (err) => {
        this.InProgress = false;
      }
    );
  }

  reset() {
    this.dialog.closeAll();
    this.Ticket = new Ticket();
    this.submitted = false;
    this.InProgress = false;
    this.filter = null;
    this.filteruser = null;
  }
}
