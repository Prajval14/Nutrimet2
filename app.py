from flask import Flask, request, redirect, url_for, render_template, session , jsonify
import sqlite3
import json
import os

# Get the directory of the current Python script
current_directory = os.path.dirname(os.path.abspath(__file__))

# Specify the relative path to the SQLite database file
database_relative_path = 'database/nutrimet_db.db'
database_file = os.path.join(current_directory, database_relative_path)

class Product:
    def __init__(self, productid, productname, productdetail, originalprice, discountPrice, isondiscount, imageURL, rating, totalquantity, category):
        self.items = []
        self.productid = productid
        self.productname = productname
        self.productdetail = productdetail
        self.originalprice = originalprice
        self.discountPrice = discountPrice
        self.isondiscount = isondiscount
        self.imageURL = imageURL
        self.rating = rating
        self.totalquantity = totalquantity
        self.category = category
class User:
    def __init__(self, first_name, last_name, email, password, address, mobile):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.address = address
        self.mobile = mobile
class Cart:
    def __init__(self):
        self.items = []

    def add_to_cart(self, product):
        # Add product to cart
        self.items.append(product)
        try:
            # Update stock quantity in DB 
            connection = sqlite3.connect(database_file)
            cursor = connection.cursor()
            cursor.execute('UPDATE t_products SET c_quantity = c_quantity - 1 WHERE c_productid = ?', (product,))
            connection.commit()
            cursor.execute('SELECT c_quantity FROM t_products WHERE c_productid = ?', (product,))
            updated_quantity = cursor.fetchone()[0]
            return updated_quantity
        except Exception as e:
            print(f"Error occurred: {str(e)}")
        finally:
            connection.close()

    def remove_from_cart(self, product):
        self.items.remove(product)
        product.totalquantity += 1

    def get_cart_total(self):
        return sum([item.discountPrice for item in self.items])

def get_products(category):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM t_products WHERE c_category = ?', (category,))
    rows = cursor.fetchall()
    connection.close()
    products = [Product(*row) for row in rows]
    return products

def get_product_by_id(product_id):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM t_products WHERE c_productid = ?', (product_id,))
    row = cursor.fetchone()
    connection.close()
    if row:
        return Product(*row)
    return None

def user_signup(user):
    try:
        connection = sqlite3.connect(database_file)
        cursor = connection.cursor()
        cursor.execute('INSERT INTO t_users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                    (user.first_name, user.last_name, user.email, user.password))
        connection.commit()
        connection.close()
        return True
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return False

def user_login(user_input_email, user_input_password):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    cursor.execute('SELECT email, password FROM t_users WHERE email = ?', (user_input_email,))
    user = cursor.fetchone()
    connection.close()

    user_exists = False
    correct_password = False
    message = ""

    if user:
        user_exists = True
        if user[1] == user_input_password:
            correct_password = True
            message = "Login successful."
            session['login_user_email'] = user[0]
        else:
            message = "Incorrect password."
    else:
        message = "User does not exist."

    return user_exists, correct_password, message

def get_user_by_id(user_id):
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM t_users WHERE email = ?', (user_id, ))
    row = cursor.fetchone()
    connection.close()
    if row:
        return User(*row)
    return None

def user_update(password=None, address=None, mobile=None):
    login_email = session.get('login_user_email', None)
    try:
        connection = sqlite3.connect(database_file)
        cursor = connection.cursor()
        if password:
            cursor.execute("UPDATE t_users SET password = ? WHERE email = ?", (password, login_email))
            connection.commit()

        if address:
            if address == 'remove':
                cursor.execute("UPDATE t_users SET address = '' WHERE email = ?", (login_email,))
            else:
                cursor.execute("UPDATE t_users SET address = ? WHERE email = ?", (address, login_email))
            connection.commit()

        if mobile:
            if mobile == 'remove':
                cursor.execute("UPDATE t_users SET mobile = '' WHERE email = ?", (login_email,))
            else:
                cursor.execute("UPDATE t_users SET mobile = ? WHERE email = ?", (mobile, login_email))
            connection.commit()
        connection.close()

        return True, "Your information has been updated successfully"

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return False, "Failed to update information"

def get_json_data(objects_list):
    object_dicts = [obj.__dict__ for obj in objects_list]
    json_data = json.dumps(object_dicts)
    return json_data

app = Flask(__name__)
app.secret_key = 'session_nutrimet'

@app.route('/', methods=['GET', 'POST'])
def index():
    request_type = request.headers.get('X-Request-Type')
    if request_type == 'logout':
        session.pop('login_user_email', None)
        if(session.get('login_user_email', None) == None):
            return jsonify({'logout_success': True})
        else:
            return jsonify({'logout_success': False})
    elif request_type == 'addtocart':
        product = request.json
        try:
            in_stock = cart.add_to_cart(product)
            return jsonify({'addtocart_success': True, 'in_stock': in_stock})
        except Exception as e:
            return jsonify({'addtocart_success': False, 'error': str(e)})
    else:
        gym_products = get_products('gym')
        yoga_products = get_products('yoga')
        supplements_products = get_products('sup')
        return render_template('index.html',
                            gym_products=get_json_data(gym_products),
                            yoga_products=get_json_data(yoga_products),
                            supplements_products=get_json_data(supplements_products))

@app.route('/aboutus', methods=['GET'])
def aboutus():
    return render_template('/html/aboutus.html')

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    login_email = session.get('login_user_email', None)
    if request.method == 'GET':
        user_info = get_user_by_id(login_email)
        if user_info:
            return render_template('/html/details.html', user_info=get_json_data([user_info]))
        else:
            return render_template('/html/signup.html')
    elif request.method == 'POST':
        request_type = request.headers.get('X-Request-Type')
        data = request.json
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        address = data.get('address')
        mobile = data.get('mobile')
        if request_type == 'signup':
            new_user = User(first_name, last_name, email, password, address="", mobile="")
            signup_success = user_signup(new_user)
            return jsonify({'signup_success': signup_success})
        elif request_type == 'updateuser':
            update_success, message = user_update(password, address, mobile)
            return jsonify({'update_success': update_success, 'message': message})
        elif request_type == 'login':
            user_exists, correct_password, message = user_login(email, password)
            response = {'user_exists': user_exists, 'correct_password': correct_password, 'message': message}
            return jsonify(response)
        else:
            return jsonify({'error': 'Invalid request type'})

@app.route('/products', methods=['GET'])
def products():
    gym_products = get_products('gym')
    yoga_products = get_products('yoga')
    supplements_products = get_products('sup')
    return render_template('/html/products.html', gym_products=get_json_data(gym_products), yoga_products=get_json_data(yoga_products), supplements_products=get_json_data(supplements_products))

@app.route('/product/<product_id>', methods=['GET'])
def product_detail(product_id):
    product = get_product_by_id(product_id)
    if product:
        return render_template('/html/productdetails.html', product=get_json_data([product]))
    return 'Product not found', 404

@app.route('/mycart', methods=['GET', 'POST'])
def mycart():
    if request.method == 'GET':
        gym_products = get_products('gym')
        yoga_products = get_products('yoga')
        supplements_products = get_products('sup')
        return render_template('/html/cart.html', 
                                cart_items=cart.items,
                                gym_products=get_json_data(gym_products),
                                yoga_products=get_json_data(yoga_products),
                                supplements_products=get_json_data(supplements_products))
    elif request.method == 'POST':
        data = request.json
        cart.items = data
        return render_template('/html/cart.html')
    else:
        return 'Invalid request method', 400

if __name__ == '__main__':
    cart = Cart()
    app.run(host='0.0.0.0', port=5000, debug=True)
