from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_mail import Mail, Message
from datetime import datetime
import bcrypt
import psycopg2

app = Flask(__name__)
app.secret_key = "^A%DJAJU^JJ123"

# conection for db
connection = psycopg2.connect(user="postgres",
    password="password",
    host="127.0.0.1",
    port="5432",
    database="normpeople")
cursor = connection.cursor()

# mail config
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT']=465
app.config['MAIL_USE_SSL']=True
app.config['MAIL_USERNAME']='chucgdaniel@gmail.com'
app.config['MAIL_PASSWORD']='yourpassword'
app.config['MAIL_DEFAULT_SENDER']='chucgdaniel@gmail.com'
app.config['MAIL_MAX_EMAILS']=None
email = Mail(app)

# view dashboard when login and register
@app.route("/dashboard")
def dashboard():
    if not session:
        return redirect(url_for('login'))
    else:
        logs = get_logs()
        return render_template("dashboard/index.html",logs=logs)

# login
@app.route("/")
@app.route("/login",methods=["GET","POST"])
def login():
    if request.method == 'GET':
        return render_template("auth/login.html")
    elif request.method == 'POST':
        data = {}
        email = request.form['email']
        password = request.form['password'].encode('utf-8')
        # search in db
        cursor.execute("SELECT * FROM users WHERE email= '%s'" % email)
        user = cursor.fetchone()
        # comparing passwords
        if user and len(user) > 0:
            if bcrypt.hashpw(password, user[3].encode('utf-8')) == user[3].encode('utf-8'):
                session['id'] = user[0]
                create_log(user)
                return url_for('dashboard')
            else:
                data['error'] = 'La contraseña es incorrecta'
        else:
            data['error'] = 'No se encontro el usuario'
        return data

# register 
@app.route("/register",methods=["POST","GET"])
def register():
    if request.method == 'GET':
        return render_template("auth/register.html")
    elif request.method == 'POST':
        data = {}
        name = request.form['name']
        email = request.form['email']
        password = request.form['password'].encode('utf-8')
        password = bcrypt.hashpw(password, bcrypt.gensalt())
        password = password.decode('utf8')
        # validate if exist
        valid = validate_unique_email(email)
        if not valid:
            data['error'] = 'El correo ya se encuentra registrado'
            return data
        # insert the new user
        insert_query = """INSERT INTO users (NAME, EMAIL, PASSWORD) VALUES (%s,%s,%s) RETURNING id"""
        insert_record = (name, email, password)
        cursor.execute(insert_query, insert_record)
        connection.commit()
        # save in the session
        session['id'] = cursor.fetchone()[0]
        # insert the log
        cursor.execute("SELECT * FROM users WHERE id = %s" % session.get("id"))
        user = cursor.fetchone()
        create_log(user)
        return url_for('dashboard')

def validate_unique_email(email):
    cursor.execute("SELECT * FROM users WHERE email = '%s'" % email)
    email = cursor.fetchone()
    valid = False if email else True
    return valid

# section forgot my password
@app.route("/forgot")
def forgot():
    return render_template("auth/forgot.html")

@app.route("/forgot/forgot_mail",methods=["POST"])
def forgot_mail():
    message = Message('Nueva contraseña',recipients=['chucgdaniel@gmail.com'])
    email.send(message)
    return 'Se ha enviado la nueva contraseña a su correo'

# close session
@app.route('/logout')
def logout():
    session.clear()
    return render_template("auth/login.html")

# search by date
@app.route('/search',methods=["POST"])
def search():
    date = request.form['date']
    logs = get_logs(date)
    return jsonify(logs)

#general

# return logs
def get_logs(date=None):
    # print(session.get("id"))
    id = session.get("id")
    if date:
        cursor.execute("SELECT * FROM logs WHERE user_id = %s and DATE(last_login) = '%s'" % (id,date))
    else:
        cursor.execute("SELECT * FROM logs WHERE user_id = %s" % id)
    return cursor.fetchall()

# insert logs logs
def create_log(user):
    insert_query = """INSERT INTO logs (USER_ID, NAME, EMAIL, LAST_LOGIN) VALUES (%s,%s,%s,%s)"""
    insert_record = (user[0], user[1], user[2],datetime.now())
    cursor.execute(insert_query, insert_record)
    connection.commit()

# for debug only
if __name__ == "__main__":
    app.run(debug=True)