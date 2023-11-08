import { HttpService } from './../http/http.service';
import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, updateEmail } from '@angular/fire/auth';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
// import { map, take, lastValueFrom } from 'rxjs/operators';
import { Strings } from 'src/app/enum/strings.enum';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

export class AuthUserId {
  constructor(public uid: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static UNKNOWN_USER = null;
  private _uid = new BehaviorSubject<AuthUserId>(AuthService.UNKNOWN_USER);

  // get userId() {
  //   return this._uid.asObservable().pipe(map(uid => {
  //       console.log(uid);
  //       if(uid) return uid
  //       else return AuthService.UNKNOWN_USER;
  //     })
  //   );
  // }

  constructor(
    private storage: StorageService,
    // private fireAuth: AngularFireAuth,
    private fireAuth: Auth,
    private apiService: ApiService,
    private http: HttpService
  ) { }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await signInWithEmailAndPassword(this.fireAuth, email, password);
      console.log(response);
      if(response.user) {
        // const token = await (await this.fireAuth.currentUser).getIdToken();
        // console.log('token: ', token);
        const user: any = await this.getUserData(response.user.uid);
        if(user?.type == Strings.TYPE || user?.type == 'admin') {
          this.setUserData(response.user.uid);
          return user.type;
        } else {
          await this.logout();
          return false;
        }               
      }
    } catch(e) {
      throw(e);
    }
  }

  async getId() {
    const user = this._uid.value;
    console.log('auth user id: ', user?.uid);
    if(user?.uid) {
      return user.uid;
    } else {
      return (await this.storage.getStorage(Strings.UID)).value;
    }
  }

  setUserData(uid) {
    this.storage.setStorage(Strings.UID, uid);
    this._uid.next(new AuthUserId(uid));
  }

  async register(formValue, type?) {
    try {
      const registeredUser = await createUserWithEmailAndPassword(this.fireAuth, formValue.email, formValue.password);
      console.log('registered user: ', registeredUser);
      const data = new User(
        formValue.email,
        formValue.phone,
        formValue.name,
        registeredUser.user.uid,
        type ? type : 'user',
        'active'
      );
      // await this.apiService.collection('users').doc(registeredUser.user.uid).set(Object.assign({}, data));
      await this.apiService.setDocument(`users/${registeredUser.user.uid}`, Object.assign({}, data));
      if(!type || type != 'restaurant') {
        await this.setUserData(registeredUser.user.uid);
      }
      const userData = {
        id: registeredUser.user.uid,
        type: type ? type : 'user'
      };
      return userData;
    } catch(e) {
      throw(e);
    }
  }

  async createUser(formValue, type) {
    try {
      const response$ = this.http.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`, 
        {
          email: formValue.email,
          password: formValue.password
          // returnSecureToken: true
        }
      );
      // const response = await (response$).toPromise();
      const response = await lastValueFrom(response$);
      console.log('registered user: ', response);
      const uid = response.localId;
      const data = new User(
        formValue.email,
        formValue.phone,
        formValue.name,
        uid,
        type,
        'active'
      );
      // await this.apiService.collection('users').doc(uid).set(Object.assign({}, data));
      await this.apiService.setDocument(`users/${uid}`, Object.assign({}, data));
      const userData = {
        id: uid,
        type
      };
      return userData;
    } catch(e) {
      throw(e);
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.fireAuth, email);
    } catch(e) {
      throw(e);
    }
  }

  async logout() {
    try {
      await this.fireAuth.signOut();
      await this.storage.removeStorage(Strings.UID);
      this._uid.next(AuthService.UNKNOWN_USER);
      return true;
    } catch(e) {
      throw(e);
    }
  }

  async updateEmail(oldEmail, newEmail, password) {
    try {
      const result = await signInWithEmailAndPassword(this.fireAuth, oldEmail, password);
      await updateEmail(result.user, newEmail);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  checkAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.fireAuth, user => {
        console.log('auth user: ', user);
        resolve(user)
        // if(user) {
        //   this.setUserData(user.uid);         
        //   resolve(user.uid);
        // } else {
        //   // this.logout();
        //   reject(false);
        // }
      });
    });
  }

  async checkUserAuth() {
    try {
      const user = await this.checkAuth();
      if(user) {
        this.setUserData(user.uid);
        const profile: any = await this.getUserData(user.uid);
        if(profile) return profile.type;
        return false;
      } else {
        return false;
      }
    } catch(e) {
      throw(e);
    }
  }

  async getUserData(id) {
    // return (await (this.apiService.collection('users').doc(id).get().toPromise())).data();
    const docSnap: any = await this.apiService.getDocById(`users/${id}`);
      if(docSnap?.exists()) {
        return docSnap.data();
      } else {
        throw('No such document exists');
      }
  }
}
